# smart-local-sandbox
Docker based sandbox for smart apps

## Install
```sh
git clone https://github.com/smart-on-fhir/smart-local-sandbox.git
cd smart-local-sandbox
npm i

# Then build and run the Docker image:
docker build -t smart-sandbox . && ./run.sh

# No you are withing the Linux image. To start the sandbox run:
./start.sh
```
You cad use <kbd>q</kbd> or <kbd>Ctrl</kbd>+<kbd>c</kbd> to exit from the
pm2 dashboard. 