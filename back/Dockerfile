FROM alpine:latest
COPY ./src /app
WORKDIR /app
RUN apk update && apk add python3 py3-pip
RUN pip install "fastapi[standard]" --break-system-packages
CMD ["python", "./main.py"]