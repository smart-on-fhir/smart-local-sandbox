import React       from "react"
import PropTypes   from "prop-types"
import { connect } from "react-redux"
import store       from "../../redux"
import {
    toggleServerConsoleFullscreen,
    toggleServerConsoleFilter,
    clearServerConsole
} from "../../redux/actions"
import "./Console.less"


const ConsoleFilter = ({log, info, warn, err, toggleFilter}) => (
    <div className="btn-group">
        <button
            type="button"
            className={ "btn btn-xs btn-default" + (log ? " active" : "") }
            onClick={ () => toggleFilter("log") }
        >
            <span className="text-success">Messages</span>
        </button>
        <button
            type="button"
            className={ "btn btn-xs btn-default" + (info ? " active" : "") }
            onClick={ () => toggleFilter("info") }
        >
            <span className="text-info">Info</span>
        </button>
        <button
            type="button"
            className={ "btn btn-xs btn-default" + (warn ? " active" : "") }
            onClick={ () => toggleFilter("warn") }
        >
            <span className="text-warning">Warnings</span>
        </button>
        <button
            type="button"
            className={ "btn btn-xs btn-default" + (err ? " active" : "") }
            onClick={ () => toggleFilter("err") }
        >
            <span className="text-danger">Errors</span>
        </button>
    </div>
)

export default class Console extends React.Component
{
    static propTypes = {
        toggleFilter: PropTypes.func.isRequired,
        filter: PropTypes.shape({
            log : PropTypes.bool,
            info: PropTypes.bool,
            warn: PropTypes.bool,
            err : PropTypes.bool
        }).isRequired,
        lines: PropTypes.arrayOf(
            PropTypes.shape({
                type: PropTypes.oneOf(["log", "info", "warn", "err", "error"]),
                message: PropTypes.string
            })
        ).isRequired,
        fullscreen: PropTypes.bool,
        clear     : PropTypes.func.isRequired
    };

    constructor(props)
    {
        super(props);
        this.shouldScroll = true;
    }

    componentDidMount()
    {
        this.scrollIfNeeded()
    }

    componentWillUpdate(nextProps)
    {
        this.shouldScroll = this.console && (
            this.console.scrollHeight -
            (this.console.scrollTop + this.console.clientHeight) < 10
        );
    }

    componentDidUpdate()
    {
        this.scrollIfNeeded()
    }

    scrollIfNeeded()
    {
        if (this.console && this.shouldScroll) {
            this.console.scrollTop = 100000;
        }
    }

    render()
    {
        let lines = this.props.lines.filter(l => !!this.props.filter[l.type]);
        return (
            <div className={"console-wrap" + (this.props.fullscreen ? " fullscreen" : "")}>
                <div className="console-toolbar btn-toolbar">
                    <ConsoleFilter { ...this.props.filter } toggleFilter={ this.props.toggleFilter }/>
                    <div className="btn-group">
                        <button
                            type="button"
                            className="btn btn-xs btn-default"
                            title="Clear Console"
                            onClick={() => this.props.clear()}
                        >
                            <i className="fas fa-trash-alt text-danger"/>
                        </button>
                        <button
                            type="button"
                            className={ "btn btn-xs btn-default" + (this.props.fullscreen ? " active" : "")}
                            title="Maximize"
                            onClick={() => this.props.toggleFullscreen() }>
                            <i className="fas fa-expand"/>
                        </button>
                    </div>
                </div>
                <div className="console" ref={console => this.console = console}>
                    <React.Fragment>
                    {
                        lines.map((line) => {
                            let type = line.type.replace("error", "err");
                            return <div className={type}>{line.message}</div>;
                        })
                    }
                    </React.Fragment>
                </div>
            </div>
        )
    }
}

export const ConsoleSTU3 = connect(
    state => state.hapiServerStu3.console,
    dispatch => ({
        toggleFullscreen: () => dispatch(toggleServerConsoleFullscreen(3)),
        toggleFilter: f => dispatch(toggleServerConsoleFilter(3, f)),
        clear:       () => dispatch(clearServerConsole(3))
    })
)(Console);

export const ConsoleSTU2 = connect(
    state => state.hapiServerStu2.console,
    dispatch => ({
        toggleFullscreen: () => dispatch(toggleServerConsoleFullscreen(2)),
        toggleFilter: f => dispatch(toggleServerConsoleFilter(2, f)),
        clear:       () => dispatch(clearServerConsole(2))
    })
)(Console);
