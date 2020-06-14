FROM node:8.9.0

ARG ENV

RUN echo environment $ENV

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN npm i -g pm2 yarn
COPY package.json yarn.lock /usr/src/app/
RUN yarn install

COPY . /usr/src/app
RUN node_modules/.bin/gulp
RUN node_modules/.bin/gulp distribute
RUN cat src/environments/environment.$ENV.ts > src/environments/environment.ts
RUN node_modules/.bin/ng build --target=production --environment=$ENV --app=app-website 
RUN echo ----------- 1st step done -----------
RUN node_modules/.bin/ng build --target=production --environment=$ENV --output-hashing=false --app=app-website-server
RUN echo ----------- 2nd step done -----------
RUN node_modules/.bin/webpack --config webpack.server.config.js --progress --colors 
RUN echo ----------- 3rd step done -----------
RUN node dist/prerender.js
RUN echo ----------- 4th step done -----------
EXPOSE 80
CMD ["pm2-docker", "dist/server.js"]
#ng build --target=production --environment=development --app=app-website && ng build --target=production --environment=development --output-hashing=false --app=app-website-server && node_modules/.bin/webpack --config webpack.server.config.js --progress --colors && node dist/prerender.js && node dist/server.js
