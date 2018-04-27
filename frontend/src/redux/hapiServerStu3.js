import React                from "react"
import constants            from "./constants"
import { createLineBuffer } from "./lib"

const EXT_DIR         = "/usr/app/ext";
const SAMPLE_DATA_DIR = EXT_DIR + "/STU-3";
const SYNTHEA_OUT_DIR = EXT_DIR + "/synthea/output/fhir_dstu2";


const lineBuffer = createLineBuffer();
const INITIAL_STATE = {
    status       : "stopped", // starting | running | crashed | stopped
    fhirVersion  : "Fhir 3.1",
    serverVersion: "HAPI 3.2.0",
    title        : "STU-3 FHIR Server",
    stu          : 3,
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
            cmd  : `node ${EXT_DIR}/tag-uploader -v -d ${EXT_DIR}/generated-sample-data/STU-3/SMART -t "smart" -S http://127.0.0.1:${ENV.HAPI_PORT_STU3}/baseDstu3`,
            description: <div>
                The 67 STU3 Core SMART Patients were developed using an improved
                version of the csv data files used to create the DSTU2 Core
                SMART Patients. The new STU3 SMART Patient Data Generator (<a
                href="https://github.com/smart-on-fhir/sample-patients-stu3"
                target="_blank">Code</a>) created these sample patients from
                data files containing a mix of de-identified clinical data and
                synthetic data elements. As an Improvement on the DSTU2
                resources you get minor data cleanup, and addition of 7
                practitioner resources.
            </div>
        },
        {
            label: "Synthea Sample Patients",
            cmd  : `node ${EXT_DIR}/tag-uploader -v -d ${EXT_DIR}/generated-sample-data/STU-3/SYNTHEA -t "synthea" -S http://127.0.0.1:${ENV.HAPI_PORT_STU3}/baseDstu3`,
            description: <div>
                The SMART Team generated 1425 Synthetic sample patients in FHIR
                STU3 format using the <a target="_blank"
                href="https://synthetichealth.github.io/synthea/">
                MITRE Synthea tool</a>. For each synthetic patient, Synthea data
                contains a complete medical history, including medications,
                allergies, medical encounters, and social determinants of health.
            </div>
        },
        {
            label: "PRO Sample Patients",
            cmd  : `node ${EXT_DIR}/tag-uploader -d ${EXT_DIR}/generated-sample-data/STU-3/PRO -t "pro" -S http://127.0.0.1:${ENV.HAPI_PORT_STU3}/baseDstu3`,
            description: <div>
                <p>The SMART Team generated 100 Sample patients using PRO data
                available online from the UK National Health Service. The data
                measures health gain in patients undergoing hip replacement,
                knee replacement, varicose vein and groin hernia surgery in
                England, based on responses to questionnaires before and after
                surgery.</p>
                <p>The Sample Patients that SMART generated (<a target="_blank"
                href="https://github.com/smart-on-fhir/sample-patients-prom">
                code</a>) contain a mixture of real and synthetic data elements,
                based on the data available in the <a target="_blank"
                href="http://content.digital.nhs.uk/catalogue/PUB23908">PROMs
                csv data package</a>. All QuestionnaireResponse resources
                contain real pre and post-operative patient survey data. For
                more information about the source of the data contained within
                the PRO resources, please see the full SMART PRO Sample Patient
                documentation.</p>
            </div>
        },
        {
            label: "Generate and insert 100 new patients",
            cmd  : `rm -rf ${SYNTHEA_OUT_DIR}/*.json && node ${EXT_DIR}/run-synthea.js --stu 3 -p 100 && node ${EXT_DIR}/tag-uploader -v -d ${EXT_DIR}/synthea/output/fhir -t "synthea" -S http://127.0.0.1:${ENV.HAPI_PORT_STU3}/baseDstu3`,
            description: <div>
                Use the MITRE Synthea tool from <a target="_blank"
                href="https://synthetichealth.github.io/synthea/">
                https://synthetichealth.github.io/synthea/</a> to generate and
                insert 100 new patients
            </div>
        }
    ]
};




export default function(state = INITIAL_STATE, action) {
    
    if (action.type === constants.SET_STATUS_STU3) {
        return $.extend(true, {}, state, { status: action.status.toLowerCase() });
    }

    if (action.type === constants.TOGGLE_CONSOLE_FILTER_STU3) {
        return $.extend(true, {}, state, {
            console: {
                filter: {
                    [action.filter]: !state.console.filter[action.filter]
                } 
            }
        });
    }

    if (action.type === constants.CLEAR_CONSOLE_STU3) {
        let out = $.extend(true, {}, state);
        out.console.lines = [];
        return out;
    }
    
    if (action.type === constants.WRITE_STDERR_STU3) {
        return lineBuffer.write(state, "err", action.message);
    }
    
    if (action.type === constants.WRITE_STDOUT_STU3) {
        return lineBuffer.write(state, "log", action.message);
    }

    if (action.type === constants.TOGGLE_CONSOLE_FULLSCREEN_STU3) {
        return $.extend(true, {}, state, {
            console: {
                fullscreen: !state.console.fullscreen
            }
        });
    }
    
    return state;
}
