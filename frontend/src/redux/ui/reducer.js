import INITIAL_STATE from "./initialState"
import actionTypes   from "./types"


export default function(state = INITIAL_STATE, action)
{
    if (action.type === actionTypes.UI_SET_ACTIVE_TAB) {
        return $.extend(true, {}, state, { activeTab: action.tab });
    }

    if (action.type === actionTypes.UI_ADD_TAB) {
        let out = $.extend(true, {}, state, { activeTab: action.tab });
        out.tabs.push(action.tab)
        return out;
    }

    if (action.type === actionTypes.UI_SHOW_TAB) {
        let out = $.extend(true, {}, state);
        out.tabs.find(t => t.id === action.id).hidden = false
        return out;
    }

    if (action.type === actionTypes.UI_HIDE_TAB) {
        let out = $.extend(true, {}, state);
        let idx = out.tabs.findIndex(t => t.id === action.id);
        out.tabs[idx].hidden = true;
        if (out.activeTab === action.id) {
            let nxt = idx > 0 ? idx - 1 : idx + 1;
            out.activeTab = out.tabs[nxt].id;
        }
        return out;
    }

    if (action.type === actionTypes.UI_ADD_ERROR) {
        let out = $.extend(true, {}, state);
        out.errors.push(action.error);
        return out;
    }

    if (action.type === actionTypes.UI_REMOVE_ERROR) {
        let out = $.extend(true, {}, state);
        out.errors.splice(action.index, 1);
        return out;
    }

    return state;
}