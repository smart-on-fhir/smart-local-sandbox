const childProcess = require("child_process");
const Broadcaster  = require("./Broadcaster");

class Monitor extends Broadcaster
{
    constructor()
    {
        super();
        this.lastCpuData = [0,0,0,0,0,0,0,0,0,0,0,0];
        this.lastCpuTime = 0;
        this.isRunning   = false;
        this._timer      = 0;
        this.systemInfo  = this.collectSystemInfo();

        this.on("connect", () => {
            if (this.connections.length === 1) {
                this.start();
            }
        });

        this.on("disconnect", () => {
            if (this.connections.length === 0) {
                this.stop();
            }
        })
    }

    start()
    {
        if (!this.isRunning) {
            this.isRunning = true;
            this.tick();
        }
    }

    stop()
    {
        if (this._timer) {
            clearTimeout(this._timer);
        }
        if (this.isRunning) {
            this.isRunning = false;
        }
    }

    tick()
    {
        return Promise.all([
            this.checkCpu(),
            this.checkMemory(),
            this.checkDisk()
        ]).then(([cpu, mem, disk]) => {
            // console.log("cpu: " + Math.round(cpu*100) / 100 + "%")
            this.broadcast("sysInfo", {
                cpuPct: cpu,
                memInfo: mem,
                disk,
                system: this.systemInfo
            });
        }).then(() => {
            if (this.isRunning) {
                this._timer = setTimeout(() => this.tick(), 1000)
            }
        });
    }

    checkCpu()
    {
        return new Promise((resolve, reject) => {
            // $2: user
            // $3: nice
            // $4: system
            childProcess.exec(
                `cat /proc/stat | awk '/^cpu[0-9]/ {print $2;}'`,
                (err, stdout, stderr) => {
                    if (err) {
                        return reject(err);
                    }
                    if (stderr) {
                        return reject(String(stderr));
                    }

                    let t = Date.now();

                    // cpu spent time in 100ths of a second
                    let out = stdout.split("\n").filter(Boolean).map((num, i) => {
                        let n = parseInt(num, 10) - (this.lastCpuData[i] || 0),
                            p = (n/((t - this.lastCpuTime) / 10)) * 100;

                        this.lastCpuData[i] += n;
                        return p;
                    });
                    
                    this.lastCpuTime = t;

                    resolve(out);
                }
            );
        });
    }

    checkMemory()
    {
        return new Promise((resolve, reject) => {
            childProcess.exec(
                `cat /proc/meminfo | awk '/^(MemTotal|MemFree)/ {print $2 $3;}'`,
                (err, stdout, stderr) => {
                    if (err) {
                        return reject(err);
                    }
                    if (stderr) {
                        return reject(String(stderr));
                    }

                    let out = stdout.split("\n").filter(Boolean)
                    resolve({
                        total: parseInt(out[0], 10),
                        free : parseInt(out[1], 10)
                    });
                }
            );
        });

        return new Promise((resolve, reject) => {
            resolve("Not implemented");cat /proc/meminfo
        });
    }

    /** 
     * Checks the available disk space. Resolves with the used space as
     * percentage.
     */
    checkDisk()
    {
        return new Promise((resolve, reject) => {
            
            // Reads the total and free sizes in blocks, but that is OK because
            // we only care about the ratio here
            childProcess.exec(
                // eg: "Blocks: Total: 16448139   Free: 12262797   Available: 11419853"
                `stat -f / | awk '/^Blocks:/ {print $3; print $5}'`,
                (err, stdout, stderr) => {
                    if (err) {
                        return reject(err);
                    }
                    if (stderr) {
                        return reject(String(stderr));
                    }

                    let out = stdout.split("\n").filter(Boolean);

                    resolve(out[1] / out[0] * 100);
                }
            )
        });
    }

    collectSystemInfo()
    {
        let data = String(childProcess.execSync(
            `uname && uname -r && uname -n && uname -o`
        )).split("\n").filter(Boolean);

        return {
            name    : data[0],
            kernel  : data[1],
            hostname: data[2],
            os      : data[3]
        };
    }
}

module.exports = Monitor;

// let monitor = new Monitor();
// monitor.start();
