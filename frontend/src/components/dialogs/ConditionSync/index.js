import React         from "react"
import ReactDOM      from "react-dom"
import socket        from "../../../socket"
import SimpleConsole from "../../Console/SimpleConsole"
import                    "../Modal.less"

const WRAPPER_ID = "dialog-container"

export default class Dialog extends React.Component
{
    static open = (props) => {
        let wrapper = document.getElementById(WRAPPER_ID);
        wrapper.style.background = "rgba(0, 0, 0, 0.2)";
        wrapper.style.display = "block";
        ReactDOM.render(<Dialog {...props}/>, wrapper);
    };

    static close = () => {
        let wrapper = document.getElementById(WRAPPER_ID);
        ReactDOM.render("", wrapper);
        wrapper.style.display = "none";
    };

    constructor(props)
    {
        super(props);
        this.state = {
            output    : "",
            pct       : 0,
            isRunning : false,
            isStopping: false,
            isError   : false
        };

        this.write = this.write.bind(this);
    }

    /**
     * Connects to the backend and sets up all the needed event handlers
     */
    componentDidMount()
    {
        socket.emit("shell.connect", id => {
            this.connectionId = id;
            socket.on("shell.stdout." + id, this.write);
            socket.on("shell.stderr." + id, this.write);
            socket.on("shell.exit." + id, (result = { data: 0 }) => {
                socket.removeListener("shell.stdout." + id, this.write);
                socket.removeListener("shell.stderr." + id, this.write);

                let code = result.data * 1;
                this.setState({
                    isRunning: false,
                    isError: code !== 0,
                    output: this.state.output + (
                        code === 0 ? "" : `\nProcess exited with code ${code}.\n`
                    )
                }, () => {
                    if (code === 0) {
                        setTimeout(Dialog.close, 600);
                    }
                });
            });
            this.setState({ isRunning: true });
            socket.emit("shell.private.run", id, this.props.command)
        });
    }

    /**
     * Appends data to the output. This method also extracts hidden completion
     * status info and makes sure that the output is not bigger than 100 lines.
     * @param {Object} input
     * @param {String} input.data 
     */
    write({ data })
    {
        let pct = this.state.pct;

        let output = String(data).replace(/\033\[8m(\d+).*?\[28m/g, ($0, $1) => {
            pct = $1 * 1
            return ""
        });
        
        output = this.state.output + output;
        output = output.split("\n");
        output = output.slice(Math.max(output.length - 100, 0), output.length);
        output = output.join("\n");
        this.setState({ output, pct });
    }

    /**
     * Renders a dialog popup with simple shell, progress bar, close buttons...
     */
    render()
    {
        return (
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-body">
                        <div style={{ margin: "0 0 5px" }}>
                            { Math.floor(this.state.pct || 0) + "% Complete" }
                        </div>
                        <div className="progress" style={{ margin: 0 }}>
                            <div className="progress-bar progress-bar-success" style={{width: this.state.pct + "%" }} />
                        </div>
                        <div className="console-wrap" style={{ margin: "10px 0 0", height: 160 }}>
                            <SimpleConsole contents={ this.state.output }/>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className={"btn btn-danger" + (this.state.isStopping ? " active" : "")}
                            disabled={ !this.state.isError && !this.state.isRunning }
                            onClick={() => {
                                this.setState({ isStopping: true })
                                socket.emit("shell.close." + this.connectionId)
                            }}
                        >Cancel</button>
                    </div>
                </div>
            </div>
        )
    }
}