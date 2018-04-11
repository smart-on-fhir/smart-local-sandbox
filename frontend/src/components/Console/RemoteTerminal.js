import React         from "react"
import PropTypes     from "prop-types"
import { connect }   from "react-redux"
import socket        from "../../socket"
import Confirm       from "../dialogs/Confirm"
import SimpleConsole from "./SimpleConsole"
import                    "./Console.less"
import {
    setRunning,
    setFullscreen
} from "../../redux/shell/actions"
import { hideTab } from "../../redux/ui/actions"


class RemoteTerminal extends React.Component
{
    static propTypes = {
        command: PropTypes.string
    };

    constructor(props)
    {
        super(props);
        this.state = {
            fullscreen: false
        };
    }

    componentDidMount()
    {
        // Defer this to avoid some react warnings
        setTimeout(() => {
            
            // If a command is specified go ahead and execute it
            if (this.props.command) { 
                socket.emit("rpc", {
                    cmd: "execute",
                    args: [ this.props.command ]
                });
            }
        }, 20);
    }

    componentWillReceiveProps(props)
    {
        if (props.command && (
            props.command !== this.props.command ||
            props.running && !this.props.running
        )) { 
            socket.emit("rpc", {
                cmd: "execute",
                args: [ props.command ]
            });
        }
    }

    render()
    {
        return (
            <div style={{ display: "flex", flex: 1, flexDirection: "column", minHeight: 120 }}>
                {
                    this.props.running ? 
                    <p><i className="fas fa-spinner fa-spin"/> Running command <b>{ this.props.command }</b>...</p> :
                    <p>Ran command <b>{ this.props.command }</b></p>
                }
                <div className={ "console-wrap" + (this.state.fullscreen ? " fullscreen" : "")}>
                    <div className="console-toolbar btn-toolbar">
                        <div className="btn-group">
                            <button
                                type="button"
                                className={ "btn btn-xs btn-default" + (this.state.fullscreen ? " active" : "")}
                                title="Maximize"
                                onClick={() => {
                                this.setState({ fullscreen: !this.state.fullscreen })
                            }}>
                                <i className="fas fa-expand"/>
                            </button>
                            <button
                                type="button"
                                className="btn btn-xs btn-default"
                                disabled={!this.props.running}
                                title="Terminate"
                                onClick={() => {
                                    Confirm.open({
                                        body: "Are you sure you want to terminate the running process?",
                                        yesBtnProps: {
                                            className: "btn btn-warning",
                                            children: "Terminate"
                                        }
                                    }).then(() => {
                                        socket.emit("shell.close", () => {
                                            console.info("Process terminated!");
                                        })
                                    })
                                }}
                            >
                                <i className="fas fa-times-circle text-danger"/>
                            </button>
                        </div>
                    </div>
                    <SimpleConsole command={ this.props.command } contents={ this.props.contents } />
                </div>
            </div>
        )
    }
}

export default connect(state => state.shell)(RemoteTerminal)