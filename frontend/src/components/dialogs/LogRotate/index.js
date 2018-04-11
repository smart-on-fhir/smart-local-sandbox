import React         from "react"
import PropTypes     from "prop-types"
import ReactDOM      from "react-dom"
import socket        from "../../../socket"
import SimpleConsole from "../../Console/SimpleConsole"
import                    "../Modal.less"

const WRAPPER_ID = "dialog-container"

export default class TaskDialog extends React.Component
{
    static open = () => {
        let wrapper = document.getElementById(WRAPPER_ID);
        wrapper.style.background = "rgba(0, 0, 0, 0.2)";
        wrapper.style.display = "block";
        ReactDOM.render(<TaskDialog/>, wrapper);
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
            output   : "",
            isRunning: false
        };
    }

    componentDidMount()
    {
        socket.emit("shell.connect", id => {
            this.connectionId = id;
            socket.on("shell.stdout." + id, result => this.write(result.data));
            socket.on("shell.stderr." + id, result => this.write(result.data));
            socket.on("shell.exit." + id, () => this.setState({ isRunning: false }));
            this.setState({ isRunning: true });
            socket.emit("shell.private.run", id, `logrotate /etc/logrotate.d/sandbox.conf --verbose`);
        });
    }

    write(data)
    {
        this.setState({
            output: this.state.output + String(data)
        });
    }

    render()
    {
        return (
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <button
                            type="button"
                            className="close"
                            onClick={ this.state.isRunning ? null : TaskDialog.close }
                        ><span aria-hidden="true">&times;</span></button>
                        <h4 className="modal-title"><i className="fas fa-terminal text-muted" /> logrotate</h4>
                    </div>
                    <div className="modal-body">
                        <div className="console-wrap" style={{ height: 160 }}>
                            <SimpleConsole contents={ this.state.output }/>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-danger"
                            disabled={ !!this.state.isRunning }
                            onClick={TaskDialog.close}
                        >Close</button>
                    </div>
                </div>
            </div>
        )
    }
}