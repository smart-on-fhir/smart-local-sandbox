import { createStore, applyMiddleware, combineReducers } from "redux"
import thunk          from "redux-thunk"
import hapiServerStu3 from "./hapiServerStu3"
import hapiServerStu2 from "./hapiServerStu2"
import ui             from "./ui/reducer"
import shell          from "./shell/reducer"
import sysMon         from "./sysMon/reducer"
import socket         from "../socket"
import { addError }   from "../redux/ui/actions"
import { write, setRunning, executeCommand, exitCommand } from "../redux/shell/actions"
import { setSystemInfo } from "../redux/sysMon/actions"
import {
    setServerStatus,
    writeServerStderr,
    writeServerStdout
} from "./actions"

 
const middleWares = [ thunk ];


if (process.env.NODE_ENV == "development" && console && console.groupCollapsed) {
    let logger = _store => next => action => {
        let result;
        if (!action.__no_log) {
            console.group(action.type)
            console.info("dispatching", action)
            result = next(action)
            console.log("next state", _store.getState())
            console.groupEnd(action.type)
        }
        else {
            result = next(action)
        }
        return result
    }
    middleWares.push(logger)
}

const store = createStore(
    combineReducers({
        hapiServerStu3,
        hapiServerStu2,
        sysMon,
        shell,
        ui
    }),
    applyMiddleware(...middleWares)
);


socket.on("stdout"            , e  => store.dispatch(writeServerStdout(e.serverVersion, e.data)));
socket.on("stderr"            , e  => store.dispatch(writeServerStderr(e.serverVersion, e.data)));
socket.on("serverStatusChange", e  => store.dispatch(setServerStatus(e.serverVersion, e.status)));
socket.on("error"             , e  => store.dispatch(addError(String(e))));
socket.on("shell.stdout"      , e  => store.dispatch(write(String(e.data))));
socket.on("shell.stderr"      , e  => store.dispatch(write(String(e.data))));
socket.on("shell.exit"        , () => store.dispatch(exitCommand()));
socket.on("shell.start"       , e  => store.dispatch(executeCommand(e)));
socket.on("sysInfo"           , e  => store.dispatch(setSystemInfo(e)));

export default store;
