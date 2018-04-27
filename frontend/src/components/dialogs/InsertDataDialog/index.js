import React       from "react"
import PropTypes   from "prop-types"
import ReactDOM    from "react-dom"
import { executeCommand } from "../../../redux/shell/actions" //"../../redux/shell/actions"
import                  "../Modal.less"

console.log(executeCommand)

const WRAPPER_ID = "dialog-container"

export default class InsertDataDialog extends React.Component
{
    static open = (args) => {
        let wrapper = document.getElementById(WRAPPER_ID);
        wrapper.style.background = "rgba(0, 0, 0, 0.2)";
        wrapper.style.display = "block";
        ReactDOM.render(<InsertDataDialog {...args}/>, wrapper);
    };

    static close = () => {
        let wrapper = document.getElementById(WRAPPER_ID);
        ReactDOM.render("", wrapper);
        wrapper.style.display = "none";
    };

    run(cmd)
    {
        this.props.dispatch(executeCommand(cmd));
        InsertDataDialog.close();
    }

    render()
    {
        return (
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header" style={{ background: "linear-gradient(transparent, #EEE)"}}>
                        <button
                            type="button"
                            className="close"
                            onClick={ InsertDataDialog.close }
                        ><span aria-hidden="true">&times;</span></button>
                        <h4 className="modal-title">Insert Data</h4>
                    </div>
                    <div className="modal-body" style={{ maxHeight: "60vh", overflow: "auto" }}>
                    {
                        this.props.insertOptions.map((o, i) => (
                            <div key={i} className="panel panel-default panel-body navbar-default">
                                <h4 className="text-primary">{ o.label }</h4>
                                <p className="text-muted">{ o.description }</p>
                                <a className="btn btn-primary" style={{ width: 100 }} href="#" onClick={() => this.run(o.cmd)}>Run</a>
                                <br/>
                            </div>
                        ))
                    }
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-default"
                            onClick={ InsertDataDialog.close }
                        >Cancel</button>
                    </div>
                </div>
            </div>
        )
    }
}
