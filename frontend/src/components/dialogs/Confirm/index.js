import React         from "react"
import PropTypes     from "prop-types"
import ReactDOM      from "react-dom"
import                    "../Modal.less"

const WRAPPER_ID = "dialog-container"

export default class Dialog extends React.Component
{
    static propTypes = {
        title      : PropTypes.string,
        body       : PropTypes.any,
        onClose    : PropTypes.func,
        size       : PropTypes.oneOf(["sm", "md", "lg"]),
        yesBtnProps: PropTypes.object,
        noBtnProps : PropTypes.object
    };

    static defaultProps = {
        size   : "sm",
        title  : "Please Confirm",
        body   : "Please Confirm",
        onClose: () => 1,
        yesBtnProps: { children: "OK" },
        noBtnProps: { children: "Cancel" }
    };

    static open = (props) => {
        return new Promise((resolve, reject) => {
            let wrapper = document.getElementById(WRAPPER_ID);
            wrapper.style.background = "rgba(0, 0, 0, 0.2)";
            wrapper.style.display = "block";
            ReactDOM.render(
                <Dialog
                    { ...props }
                    onClose={ result => {
                        if (result) {
                            resolve("User confirmed");
                        } else {
                            reject("User canceled");
                        }
                    }}
                />,
                wrapper
            );
        });
    };

    close(result)
    {
        let wrapper = document.getElementById(WRAPPER_ID);
        ReactDOM.render("", wrapper);
        wrapper.style.display = "none";
        this.props.onClose(result);
    }

    render()
    {
        return (
            <div className={"modal-dialog modal-" + this.props.size }>
                <div className="modal-content">
                    <div className="modal-header">
                        <button
                            type="button"
                            className="close"
                            data-action="reject"
                            onClick={ () => this.close(false) }
                        ><span aria-hidden="true">&times;</span></button>
                        <div className="modal-title">{ this.props.title }</div>
                    </div>
                    <div className="modal-body">
                        { this.props.body }
                    </div>
                    <div className="modal-footer">
                        <button
                            className="btn btn-default"
                            { ...this.props.noBtnProps }
                            type="button"
                            onClick={ () => this.close(false) }
                        />
                        <button
                            className="btn btn-primary"
                            { ...this.props.yesBtnProps }
                            type="button"
                            onClick={ () => this.close(true) }
                        />
                    </div>
                </div>
            </div>
        )
    }
}
