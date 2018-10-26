FROM node:alpine

COPY package.json /src/package.json
COPY src /src/src
RUN apk add curl
RUN cd /src && \
    npm i >> /dev/null && \
    sh ./src/sequelize/rebuild_dev_db.sh >> /dev/null

COPY demo /src/demo
RUN cd /src && \
    NODE_ENV=development node ./src/main start >> /dev/null && \
    node demo/init && \
    rm -R /src/demo && \
    rm /src/src/fog-controller.pid
