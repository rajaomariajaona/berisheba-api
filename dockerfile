FROM node

COPY ./package.json /webservice/package.json
WORKDIR /webservice
RUN npm install

