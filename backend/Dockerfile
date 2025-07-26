# Build stage
FROM golang:1.23 AS builder
WORKDIR /app
COPY go.mod . 
COPY go.sum . 
RUN go mod download
COPY . .
RUN go mod tidy  # 👈 Fix: Ensure dependencies are clean and up to date
RUN CGO_ENABLED=1 go build -o main ./cmd/api

# Final image
FROM alpine:latest
WORKDIR /root/
COPY --from=builder /app/main .
COPY --from=builder /app/static ./static
RUN apk add --no-cache libc6-compat
EXPOSE 8082
CMD ["./main"]
