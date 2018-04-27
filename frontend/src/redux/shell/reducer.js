import INITIAL_STATE from "./initialState"
import actionTypes   from "./types"


export default function(state = INITIAL_STATE, action)
{
    if (action.type === actionTypes.SHELL_SET_COMMAND) {
        return $.extend({}, state, { command: action.payload });
    }

    if (action.type === actionTypes.SHELL_SET_FULLSCREEN) {
        return $.extend({}, state, { fullScreen: !!action.payload });
    }

    if (action.type === actionTypes.SHELL_SET_RUNNING) {
        return $.extend({}, state, { running: !!action.payload });
    }

    if (action.type === actionTypes.SHELL_SET_ERROR) {
        return $.extend({}, state, { error: action.payload });
    }

    if (action.type === actionTypes.SHELL_SET_TITLE) {
        return $.extend({}, state, { error: action.payload });
    }

    if (action.type === actionTypes.SHELL_WRITE) {
        let nextValue = state.contents + String(action.payload);
        nextValue     = nextValue.replace(/\r\033\[2K/g, "[2K")
        nextValue     = nextValue.replace(/^.*?\[2K(.*)?$/gm, (all, after) => after);
        nextValue     = nextValue.split("\n");
        nextValue     = nextValue.slice(Math.max(nextValue.length - 500, 0), nextValue.length);
        nextValue     = nextValue.join("\n");
        return $.extend({}, state, { contents: nextValue });
    }

    return state;
}