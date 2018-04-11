const path = require("path");

const HAPI_PORT_STU3 = process.env.HAPI_PORT_STU3 || 9990;
const HAPI_PORT_STU2 = process.env.HAPI_PORT_STU2 || 9991;

module.exports = {
    HAPI_PORT_STU3,
    HAPI_PORT_STU2,
    HAPI_DIR_CLI         : path.resolve(__dirname, "../ext/hapi-fhir-3.2.0-cli"),
    HAPI_DIR_STU3        : path.resolve(__dirname, "../ext/hapi-dstu3"),
    HAPI_DIR_STU2        : path.resolve(__dirname, "../ext/hapi-dstu2"),
    HAPI_URL_STU3        : `http://127.0.0.1:${HAPI_PORT_STU3}/baseDstu3/`,
    HAPI_URL_STU2        : `http://127.0.0.1:${HAPI_PORT_STU2}/baseDstu2/`,
    SERVER_STATE_STOPPED : 2,
    SERVER_STATE_STARTING: 4,
    SERVER_STATE_RUNNING : 8,
    SERVER_STATE_CRASHED : 16,
    LOG_FILE_TAIL_LINES  : 50
};
