FROM java:8

# Install dependencies
RUN curl -sL https://deb.nodesource.com/setup_9.x | bash
RUN apt-get -y -q install nodejs lsof make g++ logrotate
RUN npm i -g pm2

# Symplify npm installs by skipping dev dependencies
ENV NODE_ENV production

# init logrotate
COPY sandbox.logrotate.conf /etc/logrotate.d/sandbox.conf

# download HAPI CLI
ADD https://github.com/jamesagnew/hapi-fhir/releases/download/v3.2.0/hapi-fhir-3.2.0-cli.tar.bz2 /usr/app/ext/hapi-fhir-3.2.0-cli/
RUN tar xvjf /usr/app/ext/hapi-fhir-3.2.0-cli/hapi-fhir-3.2.0-cli.tar.bz2

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
