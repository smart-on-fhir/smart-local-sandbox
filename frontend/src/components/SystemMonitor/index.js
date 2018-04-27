import React       from "react"
import { connect } from "react-redux"

const SysInfo = ({ name, hostname, os, kernel}) => (
    <table className="table table-condensed">
        <tbody>
            <tr className="active">
                <th className="text-right">name</th>
                <td> { name }</td>
            </tr>
            <tr className="active">
                <th className="text-right">hostname</th>
                <td> { hostname }</td>
            </tr>
            <tr className="active">
                <th className="text-right">OS</th>
                <td> { os }</td>
            </tr>
            <tr className="active">
                <th className="text-right">kernel</th>
                <td> { kernel }</td>
            </tr>
        </tbody>
    </table>
);

const LoadBars = ({cpuUsage, memText, usedMem, totalMem, diskUsage}) => (
    <div className="panel-body">
        {
            cpuUsage.map((n, i) => (
                <div key={i}>
                    <div className="small">
                        <span className="pull-right">{Math.round(n * 10) / 10}%</span>
                        <b>CPU {i + 1} Usage</b>
                    </div>
                    <div className="progress">
                        <div className="progress-bar progress-bar-danger" style={{width: n + "%", transitionTimingFunction: "ease-in-out" }} />
                    </div>
                </div>
            ))
        }
        <div className="small">
            <span className="pull-right">{ memText }</span>
            <b>Memory Usage</b>
        </div>
        <div className="progress">
            <div className="progress-bar progress-bar-warning" style={{width: (usedMem / totalMem * 100) + "%" }} />
        </div>
        <div className="small">
            <span className="pull-right">{ Math.round(diskUsage * 10) / 10 }%</span>
            <b>Disk Usage</b>
        </div>
        <div className="progress">
            <div className="progress-bar progress-bar-info" style={{width: diskUsage + "%" }} />
        </div>
    </div>
);

function SystemMonitor({ systemText, ...rest }) {
    return (
        <div className="panel panel-primary navbar-default">
            <div className="panel-heading">
                <b><i className="fas fa-chart-pie"/> System Monitor</b>
            </div>
            <SysInfo { ...systemText }/>
            <LoadBars { ...rest } />
        </div>
    );
}

export default connect(state => state.sysMon)(SystemMonitor);
