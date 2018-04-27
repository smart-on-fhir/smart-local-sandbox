import React            from "react"
import PropTypes        from "prop-types"
import { connect }      from "react-redux"
import RemoteTerminal   from "./Console/RemoteTerminal"
import { setActiveTab } from "../redux/ui/actions"
import ErrorList        from "./ErrorList"
import { hideTab }      from "../redux/ui/actions"
import { closeShell }   from "../redux/shell/actions"
import LogRotate        from "./dialogs/LogRotate/index.js"
import ConditionSync    from "./dialogs/ConditionSync"
import SystemMonitor    from "./SystemMonitor"
import                       "../style/app.less"
import {
    HapiServerViewStu2,
    HapiServerViewStu3
} from "./HapiServerView"
import {
    writeStdout,
    writeStderr,
    setStu3Status
} from "../redux/hapiServerStu3"


class App extends React.Component
{
    /**
     * Uses jQuery to make the disabled elements un-clickable
     */
    componentDidMount()
    {
        $(document).on(
            "click mousedown",
            "button:disabled, button[disabled] a:disabled, a[disabled]",
            false
        );
    }

    handleTabClick(tabId)
    {
        this.props.dispatch(setActiveTab(tabId))
    }

    render()
    {
        return (
            <div>
                <h2 className="logo-header">
                    <img src="/img/logo.svg" height="24"/> SMART Local Sandbox
                </h2>
                <ul className="nav nav-tabs main-tabs">
                    {
                        this.props.tabs.map(tab => (
                            <li
                                key={ tab.id }
                                onClick={ () => this.handleTabClick(tab.id) }
                                className={ this.props.activeTab === tab.id ? "active" : null }
                                style={{ display: tab.hidden ? "none" : "block" }}
                            >
                                <a>
                                    <span><i className={ tab.icon }/> { tab.title }</span>
                                    { tab.closable && <i
                                        className="fas fa-times-circle text-danger close-btn"
                                        title="Close"
                                        onClick={ e => {
                                            e.stopPropagation();
                                            this.props.dispatch(closeShell());
                                        }}
                                    /> }
                                </a>
                            </li>
                        ))
                    }
                </ul>
                <div className="tab-content main-tab-contents">
                    <ErrorList/>
                    
                    { this.props.activeTab == "stu3" && (
                        <div className="tab-pane active">
                            <HapiServerViewStu3/>
                        </div>
                    ) }
                    
                    { this.props.activeTab == "stu2" && (
                        <div className="tab-pane active">
                            <HapiServerViewStu2/>
                        </div>
                    ) }
                    
                    { this.props.activeTab == "advanced" && (
                        <div className="tab-pane active">
                            <div>
                            <div className="col-xs-8">
                                <h4 className="page-header"><i className="far fa-file-alt"/> Log Files</h4>
                                <p className="text-muted">
                                    You can view what log files are currently available and download them.
                                    You can also manually "rotate" them here. By default a log rotation job
                                    is executed daily. All the log files will be examined and if their file size
                                    exceeds 100 MB, they will be rotated to separate files. Up to 5 copies of each
                                    log file are stored.
                                </p>
                                <div>
                                    <button className="btn btn-primary" onClick={() => LogRotate.open()}>Rotate Logs...</button>
                                </div>

                                <h4 className="page-header"><i className="fas fa-user-md"/> Patient Conditions</h4>
                                <p className="text-muted">
                                    After you insert new data to your servers you can run this to collect a list of all the
                                    medical conditions available on your server. This list is then passed to the patient
                                    picker so that you can search for patients by condition name (in addition to searching
                                    by condition code);
                                </p>
                                <div>
                                    <button
                                        className="btn btn-info"
                                        onClick={() => ConditionSync.open({ command: `node ext/sync-conditions.js -s stu3`})}
                                        disabled={!this.props.stu3Running}
                                    >Collect STU3 Conditions...</button>
                                    &nbsp;
                                    <button
                                        className="btn btn-info"
                                        onClick={() => ConditionSync.open({ command: `node ext/sync-conditions.js -s stu2`})}
                                        disabled={!this.props.stu2Running}
                                    >Collect STU2 Conditions...</button>
                                </div>
                            </div>
                            <div className="col-xs-4">
                                <br/>
                                <SystemMonitor/>
                                <br/>
                            </div>
                            </div>
                        </div>
                    )}
                    
                    <div className={ "tab-pane" + (this.props.activeTab == "terminal" ? " active" : "") }>
                        <RemoteTerminal/>
                    </div>
                </div>
                <div className="main-footer small text-muted text-center">Version: { VERSION }</div>
            </div>
        )
    }
}

export default connect(state => ({
    ...state.ui,
    stu2Running: state.hapiServerStu2.status == "running",
    stu3Running: state.hapiServerStu3.status == "running"
}))(App);
