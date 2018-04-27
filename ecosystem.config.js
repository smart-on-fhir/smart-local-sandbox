module.exports = {
    apps : [

        // Serve the FHIR Viewer as static HTML app
        {
            name  : "fhir_viewer",
            cwd   : "/usr/app/ext/fhir-viewer/",
            script: "serve",
            env: {
                NODE_ENV      : "development",
                PM2_SERVE_PATH: ".",
                PM2_SERVE_PORT: process.env.FHIR_VIEWER_PORT
            },
            env_production : {
                NODE_ENV      : "production",
                PM2_SERVE_PATH: ".",
                PM2_SERVE_PORT: process.env.FHIR_VIEWER_PORT
            }
        },

        // The backend of the sandbox
        {
            name  : "sandbox_backend",
            script: "backend/index.js",
            cwd   : "/usr/app/",
            env   : process.env
        },

        // The Launcher
        {
            name  : "app_launcher",
            script: "src/index.js",
            cwd   : "/usr/app/ext/smart-launcher",
            env   : process.env
        }
    ]
};
