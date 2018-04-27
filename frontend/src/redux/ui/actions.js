import actionTypes from "./types"

export function setActiveTab(tab) {
    return {
        type: actionTypes.UI_SET_ACTIVE_TAB,
        tab
    }
}

export function showTab(id) {
    return {
        type: actionTypes.UI_SHOW_TAB,
        id
    }
}

export function hideTab(id) {
    return {
        type: actionTypes.UI_HIDE_TAB,
        id
    }
}

export function addError(error) {
    return {
        type: actionTypes.UI_ADD_ERROR,
        error
    }
}

export function removeError(index) {
    return {
        type: actionTypes.UI_REMOVE_ERROR,
        index
    }
}
