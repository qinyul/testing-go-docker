# Use the official Golang image to create a build artifact
FROM golang:1.22.3 AS builder

# Set the Current Working Directory inside the container
WORKDIR /app

# Copy go mod and sum files
COPY go.mod  ./

# Download dependencies. Dependencies will be cached if the go.mod and go.sum files are not changed
RUN go mod download

# Copy the source code into the container
COPY . .

# Build the Go app
RUN go build -o myservice

# Start a new stage from scratch
FROM debian:stable-slim

# Set the Current Working Directory inside the container
WORKDIR /root/

# Copy the Pre-built binary file from the previous stage
COPY --from=builder /app/myservice .

# Expose port 8080 to the outside world
EXPOSE 8080

# Command to run the executable
CMD ["./myservice"]