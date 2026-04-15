FROM alpine:latest
RUN apk update && apk add python3 py3-pip
COPY ./src/requirements.txt /
RUN pip install -r /requirements.txt --break-system-packages
COPY ./src /app
WORKDIR /app
CMD ["python", "-u", "./main.py"]