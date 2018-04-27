const childProcess = require("child_process");
const treeKill     = require("tree-kill");

const SHELL_INSTANCES = {};

function generateUID() {
    var firstPart  = (Math.random() * 46656) | 0;
    var secondPart = (Math.random() * 46656) | 0;
    return  ("0000" + firstPart .toString(36)).slice(-4) +
            ("0000" + secondPart.toString(36)).slice(-4);
}

function open(socket, callback) {
    const instance = new PrivateShell();
    SHELL_INSTANCES[instance.id] = instance;
    callback(instance.id);
}

function close(shellId) {
    let instance = SHELL_INSTANCES[shellId];
    if (!instance) {
        return console.error("Instance not found");
    }
    
    return instance.close();
}

function run(socket, shellId, cmd, options = {}) {
    let instance = SHELL_INSTANCES[shellId];
    if (!instance) {
        return console.error("Instance not found");
    }
    
    return instance.run(socket, cmd, options);
}

function PrivateShell() {
    
    const id = generateUID();
    
    let childProc = null;
    let socket    = null;

    function emit(event, ...rest) {
        return socket.emit(`${event}.${id}`, ...rest);
    }

    function handleStdout(data) {
        emit("shell.stdout", { data: String(data) });
    }

    function handleStderr(data) {
        emit("shell.stderr", { data: String(data) });
    }
    
    function handleExit(data) {
        emit("shell.exit", { data: String(data) });
    }

    function pipe() {
        childProc.stdout.on("data" , handleStdout);
        childProc.stderr.on("data" , handleStderr);
        childProc       .on("close", handleExit  );
        socket.on("shell.close." + id, () => {
            emit("shell.stdout", { data: "\nCommand terminated by user\n" });
            emit("shell.exit");
            close();
        });
    }

    function unpipe() {
        socket.removeAllListeners("shell.close." + id);
        if (childProc) {
            childProc.stdout.removeListener("data" , handleStdout);
            childProc.stderr.removeListener("data" , handleStderr);
            childProc       .removeListener("close", handleExit  );
        }
    }

    function close() {
        if (childProc) {
            unpipe();
            if (childProc.pid) {
                treeKill(childProc.pid);
            }
            childProc = null;
            socket  = null;
        }
    }

    function run(sock, command, options = {}) {
        command = String(command).trim();
        socket  = sock;
        // console.log(arguments)
        if (childProc) {
            return emit(
                "shell.stderr",
                `Trying to execute \`${command}\` while a process is running!`
            );
        }

        if (!command) {
            return emit("shell.stdout", { data: "\n" })
        }

        emit("shell.start", command);

        childProc = childProcess.exec(command, options, error => {
            if (error) {
                if (!error.signal || error.signal != "SIGTERM") {
                    console.error(error);
                }
            }
        });

        pipe();
    }

    return {
        id,
        run,
        close
    }
}



module.exports = {
    open,
    close,
    run
};
