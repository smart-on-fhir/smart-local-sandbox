CWD=`pwd`;

# docker run -it smart-sandbox:latest bash

docker run -it \
    -p 4000:4000 \
    -p 4001:4001 \
    -p 4003:4003 \
    -p 4002:4002 \
    -p 4004:4004 \
    -v $CWD/frontend/dist/:/usr/app/frontend/dist \
    -v $CWD/backend/:/usr/app/backend \
    -v $CWD/ext/hapi-dstu2:/usr/app/ext/hapi-dstu2 \
    -v $CWD/ext/hapi-dstu3:/usr/app/ext/hapi-dstu3 \
    smart-sandbox:latest bash