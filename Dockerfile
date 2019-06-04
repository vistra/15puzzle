FROM node:12.3.1

RUN npm install -g yarn
COPY package.json package.json
COPY yarn.lock yarn.lock
RUN yarn
COPY . .
RUN npm run build

ENTRYPOINT ["npm"]


