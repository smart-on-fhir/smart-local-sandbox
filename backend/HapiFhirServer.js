const childProcess = require("child_process");
const treeKill     = require("tree-kill");
const Broadcaster  = require("./Broadcaster");
const config       = require("./config");


class HapiFhirServer extends Broadcaster
{
    /**
     * Creates an instance of HapiFhirServer
     * @param {Number} fhirVersion 2 or 3 for dstu2 or stu3
     */
    constructor(fhirVersion)
    {
        super();

        /**
         * The fhir version of the instance (2 or 3 are currently supported)
         * @type {Number}
         */
        this.fhirVersion = fhirVersion;

        /**
         * Reference to the running server process (if running)
         * @type {Object}
         */
        this.childProcess = null;

        /**
         * The current status of the instance. Can be "stopped", "starting" or "running"
         * @type {String}
         */
        this.status = "stopped";

        this.port = this.fhirVersion == 3 ?
            config.HAPI_PORT_STU3 :
            config.HAPI_PORT_STU2;

        // We are about to watch a log file so make sure it exists
        let logFile = `${config[`HAPI_DIR_STU${this.fhirVersion}`]}/usage.log`;
        let logProcess = childProcess.exec(`touch ${logFile} && tail -F -n 1 ${logFile}`, {
            maxBuffer: 1024 * 1024 * 10 // overflown buffer will make tail to silently stop working :(
        });
        logProcess.stdout.on('data', data => this.broadcast("stdout", { serverVersion: this.fhirVersion, data: String(data) }));
        logProcess.stderr.on('data', data => this.broadcast("stderr", { serverVersion: this.fhirVersion, data: String(data) }));
        logProcess.on('exit', data => this.broadcast("stdout", { serverVersion: this.fhirVersion, data: "Watcher exit" }));
        logProcess.on('close', data => this.broadcast("stdout", { serverVersion: this.fhirVersion, data: "Watcher close" }));



        // Custom error messages injected into the same log --------------------
        this.on("stderr", data => this.broadcast("stderr", {
            serverVersion: this.fhirVersion,
            data: "ERROR " + String(data).replace(/\n?$/, "\n")
        }));
        
        let pid = this.isPortOpen()
        if (pid) {
            this.childProcess = { pid };
            setStatus("running");
        }

        // Notify the other side about the current status immediately
        this.on("connect", socket => {
            socket.emit("serverStatusChange", {
                serverVersion: this.fhirVersion,
                status: this.status
            });
        });
    }

    isPortOpen()
    {
        let pid;
        try {
            pid = childProcess.execSync(`lsof -Pi :${this.port} -sTCP:LISTEN -t`);
        } catch (ex) {
            // console.log(ex.stack)
        }
        return pid;
    }

    /**
     * Updates the status of the instance. If the new status is different than
     * the current one, serverStatusChange event will be broadcasted.
     * @param {String} status
     * @return {void}
     */
    setStatus(status)
    {
        if (status !== this.status) {
            this.status = status;
            this.broadcast("serverStatusChange", {
                serverVersion: this.fhirVersion,
                status: this.status
            });
        }
    }

    /**
     * Stops the server if it is running. Kills all the process children and
     * dispatches the serverStatusChange event.
     * @return {void}
     */
    stop()
    {
        if (this.childProcess) {
            treeKill(this.childProcess.pid, "SIGINT", () => {
                this.childProcess = null;
                this.setStatus("stopped");
            });
        }
    }

    /** 
     * Restarts the server (stops it, waits 1 second and then starts it again)
     * @return {void}
     */
    restart()
    {
        this.stop();
        // Wait a while before re-starting or the port can remain open
        setTimeout(() => this.start(), 1000);
    }

    start()
    {
        // Calling start on a running server does restart instead
        if (this.isPortOpen()) {
            return this.restart();
        }

        // Notify the front-ends that the server is starting
        this.setStatus("starting");
        
        // Start the HAPI server and append STDIN and STDERR to log file
        this.childProcess = childProcess.exec(
            `${config.HAPI_DIR_CLI}/hapi-fhir-cli run-server` +
            
            // If this flag is set, the server will allow resources to be
            // persisted containing external resource references
            " --allow-external-refs" +
                                                
                                                
            // If this flag is set, the server will not enforce referential
            // integrity
            " --disable-referential-integrity" +
                                                
            // Spec version to upload (default is 'dstu3')
            ` --fhirversion dstu${this.fhirVersion}` +

            // If this flag is set, the server will operate in low memory mode
            // (some features disabled)
            // " --lowmem" +

            // The port to listen on (default is 8080)
            ` --port ${this.port}` +
            
            // The time in milliseconds within which the same results will be
            // returned for multiple identical searches, or "off" (default is
            // 60000)
            // ` --reuse-search-results-milliseconds 60000` +

            // Append to log
            " >> usage.log 2>&1",
            {
                cwd: config[`HAPI_DIR_STU${this.fhirVersion}`]
            }
        );

        // Make sure we update the status on close
        this.childProcess.once('close', code => {
            if (code && code !== 0) {
                this.emit("stderr", `Server process exited with code ${code}`);
            }
            this.setStatus("stopped");
        });

        const pull = (cnt = 120) => {
            if (cnt < 0) {
                return this.emit("stderr", `Failed to start the server in 2 minutes\n`);
            }
            
            if (this.isPortOpen()) {
                return this.setStatus("running");
            }

            setTimeout(() => pull(cnt - 1), 1000)
        };

        pull(60);
    }

    resetData()
    {
        const wasStopped = this.status == "stopped";

        if (!wasStopped) {
            this.broadcast("stdout", {
                serverVersion: this.fhirVersion,
                data: "Stopping the server...\n"
            });
            this.stop();
        }

        setTimeout(() => {
            this.broadcast("stdout", {
                serverVersion: this.fhirVersion,
                data: "Deleting the database..."
            });
            try {
                childProcess.execSync(`rm -rf ${config[`HAPI_DIR_STU${this.fhirVersion}`]}/target`);
            } catch (ex) {
                console.error(ex);
            }

            if (!wasStopped) {
                this.broadcast("stdout", {
                    serverVersion: this.fhirVersion,
                    data: "\nStarting the server...\n"
                });
                this.start();
            } else {
                this.broadcast("stdout", {
                    serverVersion: this.fhirVersion,
                    data: "Done!\n"
                });
            }
        }, 1000);
    }
}

module.exports = HapiFhirServer;
