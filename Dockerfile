FROM golang:1.17-alpine as builder
WORKDIR $GOPATH/src/go.k6.io/k6
ADD . .
RUN apk --no-cache add git
RUN go mod init
RUN go install go.k6.io/xk6/cmd/xk6@latest
RUN xk6 build --with github.com/szkiba/xk6-dotenv@latest
RUN cp k6 $GOPATH/bin/k6

FROM alpine:3.13 as xk6
RUN apk add --no-cache ca-certificates && \
    adduser -D -u 12345 -g 12345 k6
COPY --from=builder /go/bin/k6 /usr/bin/k6
USER root
ENTRYPOINT ["k6"]


FROM node:16.13.0
WORKDIR /concerto
COPY --from=builder /go/bin/k6 /usr/bin/k6
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install -development
COPY . .
RUN k6 login cloud --token f86a43a6eeb1c877a2b49d1411a567cff4cd69a4f590c41e82d43bbc2d270f95
CMD [ "/bin/sh", "-c", "npm run test ; npm run helios-perf-test ; npm run generate-k6-html-report" ]