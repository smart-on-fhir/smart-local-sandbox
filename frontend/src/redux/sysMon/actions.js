import actionTypes from "./types"

export function setCpuUsage(payload) {
    return {
        type: actionTypes.SYS_MON_SET_CPU_PCT,
        __no_log: true,
        payload
    }
}

export function setFreeMemory(payload) {
    return {
        type: actionTypes.SYS_MON_SET_MEM_FREE,
        __no_log: true,
        payload
    }
}

export function setTotalMemory(payload) {
    return {
        type: actionTypes.SYS_MON_SET_MEM_TOTAL,
        __no_log: true,
        payload
    }
}

export function setDiskUsage(payload) {
    return {
        type: actionTypes.SYS_MON_SET_DISK_USAGE,
        __no_log: true,
        payload
    }
}

export function setSystemText(payload) {
    return {
        type: actionTypes.SYS_MON_SET_INFO_TEXT,
        __no_log: true,
        payload
    }
}

export function setSystemInfo(info) {
    return dispatch => {
        dispatch(setCpuUsage(info.cpuPct));
        dispatch(setTotalMemory(info.memInfo.total));
        dispatch(setFreeMemory(info.memInfo.free));
        dispatch(setDiskUsage(info.disk));
        dispatch(setSystemText(info.system));
    };
}