FROM java:8

# Install dependencies
RUN curl -sL https://deb.nodesource.com/setup_9.x | bash
RUN apt-get -y -q install nodejs lsof make g++ logrotate
RUN npm i -g pm2

# Symplify npm installs by skipping dev dependencies
ENV NODE_ENV production

RUN mkdir /usr/app

# The port on which the control panel is hosted
# ENV CONTROL_PANEL_PORT 4000

# The port on which the launcher is hosted
# ENV LAUNCHER_PORT 4001

# The port on which the DSTU2 HAPI server is hosted
# ENV HAPI_PORT_STU2 4002

# The port on which the STU3 HAPI server is hosted
# ENV HAPI_PORT_STU3 4003

# The port on which the frhir viewer is hosted
# ENV FHIR_VIEWER_PORT 4004

# Render the last N lines of the log files in the frontend
# ENV LOG_FILE_TAIL_LINES 5000

# init logrotate
COPY sandbox.logrotate.conf /etc/logrotate.d/sandbox.conf

# download HAPI CLI
ADD https://github.com/jamesagnew/hapi-fhir/releases/download/v3.2.0/hapi-fhir-3.2.0-cli.tar.bz2 /tmp/hapi-fhir-3.2.0-cli/
RUN mkdir -p /usr/app/ext/hapi-fhir-3.2.0-cli && tar xvjf /tmp/hapi-fhir-3.2.0-cli/hapi-fhir-3.2.0-cli.tar.bz2 -C /usr/app/ext/hapi-fhir-3.2.0-cli/

# install main project
COPY package.json /tmp/package.json
COPY package-lock.json /tmp/package-lock.json
RUN cd /tmp && npm install
RUN mkdir -p /usr/app && mv /tmp/node_modules /usr/app/node_modules

# install smart-launcher
RUN rm -f /tmp/package-lock.json && rm -f /tmp/package.json
COPY ext/smart-launcher/package.json /tmp/package.json
COPY ext/smart-launcher/package-lock.json /tmp/package-lock.json
RUN cd /tmp && npm install
RUN mkdir -p /usr/app/ext/smart-launcher && mv /tmp/node_modules /usr/app/ext/smart-launcher/node_modules

# install tag-uploader
RUN rm -f /tmp/package-lock.json && rm -f /tmp/package.json
COPY ext/tag-uploader/package.json /tmp/package.json
COPY ext/tag-uploader/package-lock.json /tmp/package-lock.json
RUN cd /tmp && npm install
RUN mkdir -p /usr/app/ext/tag-uploader && mv /tmp/node_modules /usr/app/ext/tag-uploader/node_modules

# install xml-uploader
RUN rm -f /tmp/package-lock.json && rm -f /tmp/package.json
COPY ext/xml-bundle-uploader/package.json /tmp/package.json
COPY ext/xml-bundle-uploader/package-lock.json /tmp/package-lock.json
RUN cd /tmp && npm install
RUN mkdir -p /usr/app/ext/xml-bundle-uploader && mv /tmp/node_modules /usr/app/ext/xml-bundle-uploader/node_modules

WORKDIR /usr/app
COPY . .

# EXPOSE $CONTROL_PANEL_PORT
# EXPOSE $LAUNCHER_PORT
# EXPOSE $HAPI_PORT_STU2
# EXPOSE $HAPI_PORT_STU3
# EXPOSE $FHIR_VIEWER_PORT

# CMD ["bash", "/usr/app/start.sh"]
