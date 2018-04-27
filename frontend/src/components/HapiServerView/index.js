import React        from "react"
import PropTypes    from "prop-types"
import { connect }  from "react-redux"
import Confirm      from "../dialogs/Confirm"
import InsertDataDialog from "../dialogs/InsertDataDialog"
import                   "./HapiServerView.less"

import {
    startServer,
    stopServer,
    restartServer,
    resetServer
} from "../../redux/actions"

import { executeCommand } from "../../redux/shell/actions"

import { ConsoleSTU3, ConsoleSTU2 } from "../Console"

export default class HapiServerView extends React.Component
{
    static propTypes = {
        status: PropTypes.oneOf(["starting", "running", "crashed", "stopped"]).isRequired,
        dispatch: PropTypes.func.isRequired
    };

    constructor(props)
    {
        super(props);
        this.handleStartClick   = this.handleStartClick.bind(this);
        this.handleStopClick    = this.handleStopClick.bind(this);
        this.handleRefreshClick = this.handleRefreshClick.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState)
    {
        return this.props.status !== nextProps.status;
    }

    handleStartClick()
    {
        this.props.dispatch(startServer(this.props.stu));
    }

    handleStopClick()
    {
        this.props.dispatch(stopServer(this.props.stu));
    }
    
    handleRefreshClick()
    {
        this.props.dispatch(restartServer(this.props.stu));
    }

    renderStatus()
    {
        if (this.props.status == "starting") {
            return <b>starting... <i className="fas fa-circle-notch fa-spin"/></b>
        }

        if (this.props.status == "running") {
            return <b className="text-success">running</b>
        }

        if (this.props.status == "crashed") {
            return <b className="text-danger"><i className="fas fa-exclamation-triangle"></i> crashed</b>
        }

        // If stopped (default)
        return <b>not running</b>
    }

    renderButtons()
    {
        return (
            <div className="fhir-server-buttons">
                { this.props.status == "stopped" && (
                    <button className="btn btn-lg btn-success" onClick={ this.handleStartClick }>
                        <i className="fas fa-play"></i> Start Server
                    </button>
                )}
                { this.props.status == "running" && (
                    <button className="btn btn-xs btn-default" onClick={ this.handleStopClick }>
                        <span className="text-danger">
                            <i className="fas fa-stop"></i> Stop
                        </span>
                    </button>
                )}
                { this.props.status == "running" && (
                    <button className="btn btn-xs btn-default" onClick={ this.handleRefreshClick }>
                        <span className="text-info">
                            <i className="fas fa-redo-alt"></i> Restart
                        </span>
                    </button>
                )}
            </div>
        )
    }

    render()
    {
        let hapiBaseURL = "http://localhost:" + ENV["HAPI_PORT_STU" + this.props.stu];

        let hapiFhirBaseUrl = hapiBaseURL + "/baseDstu" + this.props.stu;
        
        let viewerURL = "http://localhost:" +
            ENV.FHIR_VIEWER_PORT +
            "/index.html?dark&url=" +
            encodeURIComponent(hapiFhirBaseUrl + "/Patient");

        let patientBrowserUrl = "http://127.0.0.1:" + ENV.LAUNCHER_PORT +
            "/patient-browser/index.html?config=" +
            (this.props.stu == 3 ? "stu3-local" : "dstu2-local");

        return (
            <div className="fhir-server">
                <div className="fhir-server-logo">
                    <img src="/img/server.png" width="128" height="128"/>
                    <div className="small text-center text-muted">
                        <br/>
                        { this.props.serverVersion }
                        <br/>
                        { this.props.fhirVersion }
                        <br/>
                        <br/>
                        <button
                            className={"btn server-toolbar-button" + (this.props.status != "running" ? " btn-default" : " btn-primary")}
                            disabled={ this.props.status != "running" || this.props.shellRunning }
                            onClick={() => {
                                InsertDataDialog.open(this.props);
                            }}
                        >
                            Insert Data
                        </button>
                        {/* <ul className="dropdown-menu">
                            { this.props.insertOptions.map((o, i) => (
                                <li key={i}>
                                    <a href="#" onClick={() => {
                                        this.props.dispatch(executeCommand(o.cmd));
                                    }}>{ o.label }</a>
                                </li>
                            )) }
                        </ul> */}
                        <a
                            className={ "btn server-toolbar-button" + (this.props.status != "running" ? " btn-default" : " btn-info")}
                            href={ `http://127.0.0.1:${ENV.LAUNCHER_PORT}/index.html?fhir_version_2=r${this.props.stu}&fhir_version_1=r${this.props.stu}`}
                            target="_blank"
                            disabled={ this.props.status != "running" }
                        >
                            Launch Your App
                        </a>
                        <div className="btn-group server-toolbar-button">
                            <a
                                className={"btn" + (this.props.status != "running" ? " btn-default" : " btn-success")}
                                target="_blank" href={patientBrowserUrl}
                                disabled={ this.props.status !== "running" }
                                style={{ width: 108 }}
                            >Browse Data</a>
                            <button
                                type="button"
                                className={"btn dropdown-toggle" + (this.props.status != "running" ? " btn-default" : " btn-success")}
                                data-toggle="dropdown"
                                disabled={ this.props.status !== "running" }
                            >
                                <span className="caret"/>
                                <span className="sr-only">Toggle Dropdown</span>
                            </button>
                            <ul className="dropdown-menu">
                                <li><a target="_blank" href={viewerURL}>Browse JSON</a></li>
                                <li><a target="_blank" href={patientBrowserUrl}>Browse Patients</a></li>
                                <li><a target="_blank" href={hapiBaseURL}>Browse using HAPI UI</a></li>
                            </ul>
                        </div>
                        <button
                            className={"btn server-toolbar-button" + (this.props.status != "running" ? " btn-default" : " btn-danger")}
                            onClick={() => {
                                Confirm.open({
                                    title: <b className="text-danger">Please Confirm</b>,
                                    body: (
                                        <div>
                                            <img height="64" className="pull-left" src="/img/warning.png" style={{ marginRight: 5 }}/>
                                            This will delete the database and all the data will be lost.<br/>
                                            <b>Are you sure?</b>
                                            <br clear="all"/>
                                        </div>
                                    ),
                                    yesBtnProps: {
                                        className: "btn btn-danger",
                                        children: "Reset"
                                    }
                                }).then(() => {
                                    this.props.dispatch(resetServer(this.props.stu));
                                })
                            }}
                        >
                            <span className={this.props.status != "running" ? "text-danger" : null}>Reset Data</span>
                        </button>
                    </div>
                </div>
                <div className="fhir-server-body">
                    <div>
                        <div className="pull-left">
                            <h3>{ this.props.title }</h3>
                            <p>The server is { this.renderStatus()}</p>
                        </div>
                        <div className="pull-left">
                            { this.renderButtons() }
                        </div>
                    </div>
                    {
                        this.props.stu == 3 ?
                        <ConsoleSTU3/> :
                        <ConsoleSTU2/>
                    }
                </div>
            </div>
        )
    }
}

export const HapiServerViewStu3 = connect(state => {
    let { console, ...rest } = state.hapiServerStu3
    return {
        ...rest,
        shellRunning: state.shell.running
    }
})(HapiServerView);

export const HapiServerViewStu2 = connect(state => {
    let { console, ...rest } = state.hapiServerStu2
    return {
        ...rest,
        shellRunning: state.shell.running
    }
})(HapiServerView);
