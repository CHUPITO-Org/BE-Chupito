FROM node:18.16-alpine AS build

EXPOSE 5002

WORKDIR /application

COPY . .

# Everything in a single RUN, to avoid unecessary docker layers.
RUN  yarn install --production

# Silent start because we want to have our log format as the first log
CMD ["npm", "start"]
