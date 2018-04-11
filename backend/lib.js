function createLineBuffer(minLength, onCommit)
{
    var _buff = "", _timer = 0;

    function write(str)
    {
        if (_timer) {
            clearTimeout(_timer);
        }
        _timer = setTimeout(flush, 500);
        _buff += str;
        if (_buff.length > minLength) {
            onCommit(_buff);
            _buff = "";
        }
    }

    function flush()
    {
        if (_buff) {
            onCommit(_buff);
        }
    }

    return { write, flush };
}

module.exports = {
    createLineBuffer
};