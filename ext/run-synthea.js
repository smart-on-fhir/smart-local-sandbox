const Props        = require("properties");
const childProcess = require("child_process");
const fs           = require("fs");

const filePath = "/usr/app/ext/synthea/src/main/resources/synthea.properties";

function loadConfig() {
    return Props.parse(
        fs.readFileSync(filePath, "utf8"),
        { namespaces: false }
    );
}

function saveConfig(data) {
    fs.writeFileSync(filePath, Props.stringify(data), "utf8");
}

let args = process.argv.slice(2).join(" ");
let cfg  = loadConfig();


cfg["exporter.ccda.export"]                    = false;
cfg["exporter.fhir.use_shr_extensions"]        = false;
cfg["exporter.csv.export"]                     = false;
cfg["exporter.text.export"]                    = false;
cfg["exporter.cost_access_outcomes_report"]    = false;
cfg["exporter.prevalence_report"]              = false;
cfg["generate.append_numbers_to_person_names"] = false;

args = args.replace(/--stu (2|3)\s*/, function(all, stu)  {
    if (stu == "2") {
        cfg["exporter.fhir.export"]       = false;
        cfg["exporter.fhir_dstu2.export"] = true;
    }
    else if (stu == "3") {
        cfg["exporter.fhir.export"]       = true;
        cfg["exporter.fhir_dstu2.export"] = false;
    }
    return "";
});

saveConfig(cfg);

childProcess.spawn("/usr/app/ext/synthea/run_synthea", args.split(/\s+/), {
    cwd  : "/usr/app/ext/synthea/",
    stdio: "inherit"
});
