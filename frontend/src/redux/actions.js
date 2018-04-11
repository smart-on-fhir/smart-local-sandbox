import constants from "./constants"
import socket    from "../socket"


export function clearServerConsole(stu) {
    return {
        type: constants["CLEAR_CONSOLE_STU" + stu]
    }
}

export function writeServerStdout(stu, message) {
    return {
        type: constants["WRITE_STDOUT_STU" + stu],
        message
    }
}

export function writeServerStderr(stu, message) {
    return {
        type: constants["WRITE_STDERR_STU" + stu],
        message
    }
}

export function toggleServerConsoleFilter(stu, filter) {
    return {
        type: constants["TOGGLE_CONSOLE_FILTER_STU" + stu],
        filter
    }
}

export function toggleServerConsoleFullscreen(stu) {
    return {
        type: constants["TOGGLE_CONSOLE_FULLSCREEN_STU" + stu]
    }
}

export function setServerStatus(stu, status) {
    return {
        type: constants["SET_STATUS_STU" + stu],
        status
    }
}

export function startServer(stu) {
    return (dispatch) => {
        dispatch(setServerStatus(stu, "starting"))
        socket.emit("rpc", { cmd: "startHapiServer" + stu })
    }
}

export function stopServer(stu) {
    return (dispatch) => {
        socket.emit("rpc", { cmd: "stopHapiServer" + stu })
    }
}

export function restartServer(stu) {
    return (dispatch) => {
        socket.emit("rpc", { cmd: "restartHapiServer" + stu })
    }
}

export function resetServer(stu) {
    return (dispatch) => {
        socket.emit("rpc", { cmd: "resetHapiServer" + stu })
    }
}
