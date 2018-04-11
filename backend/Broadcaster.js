const EventEmitter = require("events");

/**
 * Base class for objects that know how to broadcast events to websocket
 * connections...
 */
class Broadcaster extends EventEmitter
{
    constructor()
    {
        super();
        this.connections = [];
    }

    /**
     * Broadcasts events to every connected socket
     */
    broadcast(...args)
    {
        // console.log("broadcast: ", ...args)
        return this.connections.forEach(socket => socket.emit(...args));
    }

    connect(socket)
    {
        if (!this.connections.find(s => s.id === socket.id)) {
            this.connections.push(socket);
            this.emit("connect", socket);
        }
    }

    disconnect(socket)
    {
        let idx = this.connections.findIndex(s => s.id === socket.id);
        if (idx > -1) {
            this.connections.splice(idx, 1);
            this.emit("disconnect", socket);
        }
    }
}

module.exports = Broadcaster;