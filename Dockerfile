#FROM node:8-alpine as build-step
#WORKDIR /ng-app
#COPY package*.json ./
#RUN npm set progress=false && npm config set depth 0 && npm cache clean --force
#RUN npm install
#RUN npm i /ng-app && cp -R ./node_modules ./ng-app
#COPY . .
#RUN npm run build --prod --build-optimizer*/

FROM node:12
WORKDIR /app
ENV NODE_ENV production
COPY package*.json ./
RUN npm install
COPY . .
RUN npm install -g pm2
EXPOSE 3000
CMD [ "pm2-runtime", "index.js" ]
# RUN rm -rf /usr/share/nginx/html/*
# COPY nginx/default.conf /etc/nginx/conf.d/
# COPY /dist/test-docker /user/share/nginx/html
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]