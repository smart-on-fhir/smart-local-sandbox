import actionTypes                        from "./types"
import socket                             from "../../socket"
import { createActionCreator }            from "../lib"
import { setActiveTab, showTab, hideTab } from "../ui/actions"
import React                              from "react"
import Confirm                            from "../../components/dialogs/Confirm"

export const setCommand    = createActionCreator(actionTypes.SHELL_SET_COMMAND);
export const setRunning    = createActionCreator(actionTypes.SHELL_SET_RUNNING);
export const setError      = createActionCreator(actionTypes.SHELL_SET_ERROR);
export const setFullscreen = createActionCreator(actionTypes.SHELL_SET_FULLSCREEN);
export const setTitle      = createActionCreator(actionTypes.SHELL_SET_TITLE);
export const write         = createActionCreator(actionTypes.SHELL_WRITE);

export function executeCommand(cmd)
{
    return dispatch => {
        dispatch(setCommand(cmd));
        dispatch(setRunning(true));
        dispatch(setError(null));
        dispatch(setActiveTab("terminal"));
        dispatch(showTab("terminal"));
    };
}

export function exitCommand()
{
    return dispatch => {
        dispatch(setRunning(false));
        dispatch(setError(null));
    };
}

export function closeShell()
{
    return (dispatch, getState) => {

        if (getState().shell.running) {
            Confirm.open({
                title: <b className="text-danger">Please Confirm</b>,
                body: (
                    <div>
                        <img height="64" className="pull-left" src="/img/warning.png" style={{ marginRight: 5 }}/>
                        Closing this tab will terminate the running process.<br/>
                        <b>Are you sure?</b>
                        <br clear="all"/>
                    </div>
                ),
                yesBtnProps: {
                    className: "btn btn-danger",
                    children: "Close"
                }
            }).then(() => {
                socket.emit("shell.close", () => {
                    setTimeout(() => {
                        dispatch(hideTab("terminal"));
                    }, 50);
                });
            });
        }

        else {
            dispatch(hideTab("terminal"));
        }
    }
}