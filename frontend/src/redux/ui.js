const DEFAULT_STATE = {

    activeTab: "stu3",

    tabs: [
        {
            id   : "stu3",
            title: "STU3 Fhir Server",
            icon : "fas fa-server"
        },
        {
            id   : "stu2",
            title: "STU2 Fhir Server",
            icon : "fas fa-server"
        },
        {
            id   : "settings",
            title: "Settings",
            icon : "fas fa-cog"
        },
        {
            id   : "terminal",
            title: "Terminal",
            icon : "fas fa-terminal",
            hidden: true
        }
    ]

};

const SET_ACTIVE_TAB = "SET_ACTIVE_TAB";
export function setActiveTab(tab)
{
    return {
        type: SET_ACTIVE_TAB,
        tab
    }
}

export default function(state = DEFAULT_STATE, action)
{
    if (action.type == SET_ACTIVE_TAB) {
        return $.extend(true, {}, state, { activeTab: action.tab });
    }

    if (action.type == "ADD_TAB") {
        let out = $.extend(true, {}, state, { activeTab: action.tab });
        out.tabs.push(action.tab)
        return out;
    }

    if (action.type == "SHOW_TAB") {
        let out = $.extend(true, {}, state);
        out.tabs.find(t => t.id === action.id).hidden = false
        return out;
    }

    if (action.type == "HIDE_TAB") {
        let out = $.extend(true, {}, state);
        out.tabs.find(t => t.id === action.id).hidden = true
        return out;
    }

    return state;
}