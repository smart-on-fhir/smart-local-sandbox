const express        = require("express");
const morgan         = require("morgan");
const HapiFhirServer = require("./HapiFhirServer");
const Shell          = require("./Shell");
const config         = require("./config");
const Monitor        = require("./Monitor");
const PrivateShell   = require("./PrivateShell");

const app         = express();
const server      = require('http').Server(app);
const io          = require('socket.io')(server);
const HAPIServer2 = new HapiFhirServer(2);
const HAPIServer3 = new HapiFhirServer(3);
const shell       = new Shell();
const monitor     = new Monitor();

app.use(morgan("combined"));

const RPC = {
    startHapiServer3  : () => HAPIServer3.start(),
    startHapiServer2  : () => HAPIServer2.start(),
    stopHapiServer3   : () => HAPIServer3.stop(),
    stopHapiServer2   : () => HAPIServer2.stop(),
    restartHapiServer3: () => HAPIServer3.restart(),
    restartHapiServer2: () => HAPIServer2.restart(),
    resetHapiServer3  : () => HAPIServer3.resetData(),
    resetHapiServer2  : () => HAPIServer2.resetData(),
    execute           : (socket, cmd) => shell.run(socket, cmd)
};

function tick() {
    console.log(
        "Connections",
        "\n\tmonitor: ", monitor.connections.length,
        "\n\t  shell: ", shell.connections.length,
        "\n\t  DSTU2: ", HAPIServer2.connections.length,
        "\n\t  DSTU3: ", HAPIServer3.connections.length
    );
    setTimeout(tick, 2000)
}
// tick();

io.on("connection", socket => {

    socket.once('disconnecting', (reason) => {
        socket.removeAllListeners("rpc");
        HAPIServer2.disconnect(socket);
        HAPIServer3.disconnect(socket);
        shell.disconnect(socket);
        monitor.disconnect(socket);
    });
    
    HAPIServer2.connect(socket);
    HAPIServer3.connect(socket);
    shell.connect(socket);
    monitor.connect(socket);

    socket.on("rpc", ({ cmd, args }, callback) => {
        // console.log(`rpc: ${cmd}(${args})`);
        if (!cmd) {
            return socket.emit("error", "The 'cmd' argument is required for RPC calls");
        }
    
        if (!RPC.hasOwnProperty(cmd)) {
            return socket.emit("error", `The "${cmd}" command is unknown or not registered as RPC`);
        }
    
        let result;
        try {
            result = RPC[cmd].apply(null, [socket, ...(args || [])]);
        } catch (error) {
            socket.emit("error", error);
            result = error;
        }
        if (callback) callback(result);
    });

    socket.on("shell.connect", callback => {
        PrivateShell.open(socket, callback);
    });
    socket.on("shell.private.run", function(shellId, cmd, options = {}) {
        
        PrivateShell.run(socket, shellId, cmd, options);
    });

});

app.use("/env", (req, res) => {
    res.type("javascript").end(`var ENV = ${JSON.stringify(process.env, null, 4)};`);
});

app.use(express.static(__dirname + "/static"));

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

server.listen(4000);
