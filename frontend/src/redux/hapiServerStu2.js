import React     from "react"
import constants from "./constants"

const EXT_DIR         = "/usr/app/ext";
const SAMPLE_DATA_DIR = EXT_DIR + "/DSTU-2";
const SYNTHEA_OUT_DIR = EXT_DIR + "/synthea/output/fhir_dstu2";

const INITIAL_STATE = {
    status       : "stopped", // starting | running | crashed | stopped
    fhirVersion  : "Fhir 2.1",
    serverVersion: "HAPI 3.2.0",
    title        : "DSTU-2 FHIR Server",
    stu          : 2,
    console: {
        filter: {
            log : true,
            info: true,
            warn: true,
            err : true
        },
        lines: [],
        maxLength : 600,
        fullscreen: false
    },
    insertOptions: [
        {
            label: "SMART Sample Patients",
            description: (
                <div>
                    <p>
                        67 DSTU2 Core SMART Patients were created using the
                        <a href="https://github.com/smart-on-fhir/sample-patients"
                        target="_blank">SMART Patient Data Generator</a>. This
                        tool creates sample patients in DSTU2 format from csv
                        data files. The SMART sample patient records contain a
                        mix of data derived from real de-identified patient
                        records, as well as some synthetic data elements.
                    </p>
                    <p>
                        Resources include: AllergyIntolerance, Binary, Condition,
                        DocumentReference, Encounter, FamilyMemberHistory,
                        Immunization, MedicationDispense, MedicationRequest,
                        Observation, Patient, and Procedure.
                    </p>
                </div>
            ),
            cmd  : `node ${EXT_DIR}/xml-bundle-uploader -d ${EXT_DIR}/generated-sample-data/DSTU-2/SMART -s http://127.0.0.1:${ENV.HAPI_PORT_STU2}/baseDstu2`
        },
        {
            label: "Synthea Sample Patients",
            description: (
                <p>
                    The SMART Team generated 1461 Synthetic sample patients
                    in FHIR DSTU2 format using the <a target="_blank"
                    href="https://synthetichealth.github.io/synthea/">MITRE
                    Synthea tool</a>. For each synthetic patient, Synthea
                    data contains a complete medical history, including
                    medications, allergies, medical encounters, and social
                    determinants of health.
                </p>
            ),
            cmd: `node ${EXT_DIR}/tag-uploader -v -d ${EXT_DIR}/generated-sample-data/DSTU-2/SYNTHEA -t "synthea" -S http://127.0.0.1:${ENV.HAPI_PORT_STU2}/baseDstu2`
        },
        // {
        //     label: "Generate and insert 10 new patients",
        //     description: <div>
        //         Use the MITRE Synthea tool from <a target="_blank"
        //         href="https://synthetichealth.github.io/synthea/">
        //         https://synthetichealth.github.io/synthea/</a> to generate and
        //         insert 10 new patients
        //     </div>,
        //     cmd  : `rm -rf ${SYNTHEA_OUT_DIR}/*.json && node ${EXT_DIR}/run-synthea.js --stu 2 -p 10 && node ${EXT_DIR}/tag-uploader -v -d ${SYNTHEA_OUT_DIR} -t "synthea" -S http://127.0.0.1:${ENV.HAPI_PORT_STU2}/baseDstu2`
        // },
        {
            label: "Generate and insert 100 new patients",
            description: <div>
                Use the MITRE Synthea tool from <a target="_blank"
                href="https://synthetichealth.github.io/synthea/">
                https://synthetichealth.github.io/synthea/</a> to generate and
                insert 100 new patients
            </div>,
            cmd  : `rm -rf ${SYNTHEA_OUT_DIR}/*.json && node ${EXT_DIR}/run-synthea.js --stu 2 -p 100 && node ${EXT_DIR}/tag-uploader -v -d ${SYNTHEA_OUT_DIR} -t "synthea" -S http://127.0.0.1:${ENV.HAPI_PORT_STU2}/baseDstu2`
        }
    ]
};

let lastMessage = "";
function writeMessage(state, type, message)
{    
    let out = $.extend(true, {}, state);
    
    lastMessage += message;

    let lines = lastMessage.split(/\n/);
    
    lastMessage = lines.pop();
    
    lines = lines.map(l => {
        let tag = l.match(/^(\d\d:\d\d:\d\d\s+)?(\w+)\s+/);
        if (tag && tag[2]) {
            tag = tag[2].toLowerCase();
            if (tag == "info") {
                return { type: "info", message: l };
            }
            if (tag == "warn") {
                return { type: "warn", message: l };
            }
            if (tag == "error") {
                return { type: "err", message: l };
            }
        }
        return { type: type || "log", message: l };
    });

    out.console.lines = out.console.lines.concat(lines);
    out.console.lines = out.console.lines.slice(state.console.maxLength * -1);
    return out;
}

export default function(state = INITIAL_STATE, action) {
    
    if (action.type === constants.SET_STATUS_STU2) {
        return $.extend(true, {}, state, { status: action.status.toLowerCase() });
    }

    if (action.type === constants.TOGGLE_CONSOLE_FILTER_STU2) {
        return $.extend(true, {}, state, {
            console: {
                filter: {
                    [action.filter]: !state.console.filter[action.filter]
                } 
            }
        });
    }

    if (action.type === constants.CLEAR_CONSOLE_STU2) {
        let out = $.extend(true, {}, state);
        out.console.lines = [];
        return out;
    }
    
    if (action.type === constants.WRITE_STDERR_STU2) {
        return writeMessage(state, "err", action.message);
    }
    
    if (action.type === constants.WRITE_STDOUT_STU2) {
        return writeMessage(state, "log", action.message);
    }

    if (action.type === constants.TOGGLE_CONSOLE_FULLSCREEN_STU2) {
        return $.extend(true, {}, state, {
            console: {
                fullscreen: !state.console.fullscreen
            }
        });
    }
    
    return state;
}
