# 
# Fonterra Mulesoft Concerto Image
# 

# Go is required for k6 and xk6
FROM golang:1.19-alpine as builder
WORKDIR $GOPATH/src/go.k6.io/k6
ADD . .
RUN apk --no-cache add git
RUN go mod init
RUN go install go.k6.io/xk6/cmd/xk6@latest
RUN xk6 build --with github.com/szkiba/xk6-dotenv@latest
RUN cp k6 $GOPATH/bin/k6

# Additional settings for xk6
FROM alpine:3.13 as xk6
RUN apk add --no-cache ca-certificates && \
    adduser -D -u 12345 -g 12345 k6
COPY --from=builder /go/bin/k6 /usr/bin/k6
USER root
ENTRYPOINT ["k6"]

# node is required for functional integration tests
FROM node:16.13.0
WORKDIR /concerto
COPY --from=builder /go/bin/k6 /usr/bin/k6
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install -development
COPY . .

# Commented out the CMD command below as this needs to be executed 
# later when running the tests
#CMD [ "/bin/sh", "-c", "npm run test ; npm run generate-k6-config ; npm run perf-test ; npm run generate-k6-html-report" ]

# PowerShell > docker build -t concerto .
# Linux      > sudo docker build -t concerto .
# PowerShell > docker run -v ${PWD}\results:/concerto/results -p 80:80 -p 443:443 concerto
# CMD        > docker run -v %cd%\results:/concerto/results -p 80:80 -p 443:443 concerto
# LINUX      > sudo docker run -v $(pwd)/results:/concerto/results -p 80:80 -p 443:443 concerto