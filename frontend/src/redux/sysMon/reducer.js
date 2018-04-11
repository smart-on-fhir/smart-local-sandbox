import INITIAL_STATE from "./initialState"
import actionTypes   from "./types"

function getReadableFileSizeString(fileSizeInBytes, base = 1024) {
    var i = -1;
    var byteUnits = ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    do {
        fileSizeInBytes = fileSizeInBytes / base;
        i++;
    } while (fileSizeInBytes > base);
    return Math.max(fileSizeInBytes, 0.1).toFixed(1) + byteUnits[i];
};


export default function(state = INITIAL_STATE, action)
{
    if (action.type === actionTypes.SYS_MON_SET_CPU_PCT) {
        return $.extend({}, state, { cpuUsage: action.payload });
    }

    if (action.type === actionTypes.SYS_MON_SET_MEM_FREE) {
        let used = state.totalMem - action.payload;
        return $.extend(true, {}, state, {
            freeMem: action.payload,
            usedMem: used,
            memText: `${getReadableFileSizeString(used * 1024)} used of ${
                getReadableFileSizeString(state.totalMem * 1024)
            } total`
        });
    }

    if (action.type === actionTypes.SYS_MON_SET_MEM_TOTAL) {
        let used = action.payload - state.freeMem;
        return $.extend(true, {}, state, {
            totalMem: action.payload,
            usedMem : action.payload - state.freeMem,
            memText: `${getReadableFileSizeString(used * 1024)} used of ${
                getReadableFileSizeString(action.payload * 1024)
            } total`
        });
    }

    if (action.type === actionTypes.SYS_MON_SET_DISK_USAGE) {
        return $.extend({}, state, { diskUsage: action.payload });
    }

    if (action.type === actionTypes.SYS_MON_SET_INFO_TEXT) {
        return $.extend({}, state, { systemText: action.payload });
    }

    return state;
}