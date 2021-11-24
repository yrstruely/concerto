# syntax=docker/dockerfile:1

FROM node:16.13.0
ENV NODE_ENV=development

WORKDIR /app
RUN apt-get update
RUN apt-get install dirmngr --install-recommends
RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
RUN echo "deb https://dl.k6.io/deb stable main" | tee /etc/apt/sources.list.d/k6.list
RUN apt-get update
RUN apt-get install k6
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install -development
COPY . .
CMD ["node", "index.js"]
