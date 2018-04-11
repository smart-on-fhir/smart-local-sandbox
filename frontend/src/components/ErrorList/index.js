import React           from "react"
import PropTypes       from "prop-types"
import { connect }     from "react-redux"
import { removeError } from "../../redux/ui/actions"
import "./ErrorList.less"


class ErrorList extends React.Component
{
    static propTypes = {
        errors: PropTypes.arrayOf(PropTypes.string).isRequired,
        removeError: PropTypes.func.isRequired
    };

    render()
    {
        if (!this.props.errors.length) {
            return null;
        }

        return (
            <div className="error-list small text-danger bg-danger">
                { this.props.errors.map((e, i) => (
                    <div key={ "error-" + i }>
                        <i
                            className="fas fa-times-circle text-danger close-btn"
                            title="Close"
                            onClick={ () => this.props.removeError(i) }
                        />
                        <i className="fas fa-exclamation-circle"/>{ e }
                    </div>
                )) }
            </div>
        )
    }
}

export default connect(
    state => ({
        errors: state.ui.errors
    }),
    dispatch => ({
        removeError: index => dispatch(removeError(index))
    })
)(ErrorList);
