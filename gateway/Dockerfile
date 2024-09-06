FROM golang:alpine
WORKDIR /app
COPY go.mod ./
RUN go mod download
COPY . .
RUN go build -v -o server
EXPOSE 3000
CMD ["/app/server"]