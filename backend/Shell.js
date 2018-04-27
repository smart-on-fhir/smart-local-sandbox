const childProcess = require("child_process");
const treeKill     = require("tree-kill");
const Broadcaster  = require("./Broadcaster");
const config       = require("./config");
const lib          = require("./lib");


class Shell extends Broadcaster
{
    constructor()
    {
        super();

        this.process = null;

        // bind event handlers to the instance
        this.handleConnect     = this.handleConnect.bind(this);
        this.handleRemoteClose = this.handleRemoteClose.bind(this);
        this.handleStdout      = this.handleStdout.bind(this);
        this.handleStderr      = this.handleStderr.bind(this);
        this.handleExit        = this.handleExit.bind(this);

        // Sometimes the process can output characters too fast and overflow
        // the frontend trying to re-render on every change. That's why we
        // buffer the output and spit it in chunks of 50 or more characters.
        // Note that the buffer will be automatically flushed if it remains
        // below 50 characters for more than 500ms.
        this.stdoutBuffer = lib.createLineBuffer(50, this.handleStdout);

        this.on("connect", this.handleConnect);
    }

    handleConnect(socket)
    {
        socket.on("shell.close", cb => {
            this.broadcast("shell.stdout", {
                data: "\nCommand terminated by user\n"
            });
            this.broadcast("shell.exit");
            this.close();
            if (typeof cb == "function") {
                cb();
            }
        });
    }

    handleStdout(data)
    {
        this.broadcast("shell.stdout", {
            data: String(data)
        });
    }

    handleStderr(data)
    {
        this.broadcast("shell.stderr", {
            data: String(data)
        });
    }
    
    handleExit(data)
    {
        this.broadcast("shell.exit", {
            data: String(data)
        });
    }

    handleRemoteClose(pid)
    {
        if (this.process && pid == this.process.pid) {
            this.close();
        }
    }

    // -------------------------------------------------------------------------

    run(socket, command, options = {})
    {
        command = String(command).trim();

        if (this.process) {
            return this.broadcast(
                "shell.stderr",
                `Trying to execute \`${command}\` while a process is running!`
            );
        }

        if (!command) {
            return this.broadcast("shell.stdout", { data: "\n" })
        }

        this.broadcast("shell.start", command);

        this.process = childProcess.exec(command, options, error => {
            if (error) {
                console.error(error)
                this.broadcast("shell.stderr", { data: String(error) + "\n" })
            }
            this.close();
        });

        // this.process.stdout.on('data' , this.handleStdout);
        this.process.stdout.on("data", this.stdoutBuffer.write);
        this.process.stderr.on('data' , this.handleStderr);
        this.process       .on('close', this.handleExit  );
    }

    unpipe()
    {
        if (this.process) {
            if (this.process.stdout) {
                this.process.stdout.removeListener("data", this.handleStdout);
            }
            if (this.process.stderr) {
                this.process.stderr.removeListener("data", this.handleStderr);
            }
            this.process.removeListener("close", this.handleExit);
        }
    }

    close()
    {
        if (this.process) {
            this.unpipe();
            if (this.process.pid) {
                treeKill(this.process.pid);
            }
            this.process = null;
        }
    }
}

module.exports = Shell;
