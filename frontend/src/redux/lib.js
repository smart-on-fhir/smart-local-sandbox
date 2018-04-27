export function createActionCreator(type)
{
    return payload => ({ type, payload });
}

export function createLineBuffer()
{
    let buffer = "";
    const RE = /^(\d\d:\d\d:\d\d\s+)?(info|warn|error)\s+/i;

    function decorateLine(l, defaultType = "log")
    {
        let tag = l.match(RE);
        if (tag && tag[2]) {
            return { type: tag[2].toLowerCase(), message: l };
        }
        return { type: defaultType || "log", message: l };
    }

    function _write(state, type, message = "")
    {
        let i = message.indexOf("\n");

        if (i > -1) {
            let len = state.console.lines.push(
                decorateLine(buffer + message.substr(0, i + 1), type)
            );
            buffer = "";
            if (len > state.console.maxLength) {
                state.console.lines.shift();
            }
            return _write(state, type, message.substr(i + 1));
        }
        buffer += message;
        return state;
    }

    return {
        write: (state, type, message) => {
            return _write($.extend(true, {}, state), type, message);
        }
    };
}