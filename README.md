# FIN-Profi
React + fast API web-app for learning about investments
## Prerequisites
1. Docker
2. Docker compose
## Building
1. Clone the project
  - via HTTPS:
  ```sh
  git clone https://github.com/iinshot/FIN_profi.git
  ```
  - via SSH:
  ```sh
  git@github.com:iinshot/FIN_profi.git
  ```
2. Navigate to project's directory:
```sh
cd FIN_profi
```
2. Create ```.env``` file in project's root:
```
HOST_PORT=80
HOST_PORT_HTTPS=443
```
3. Create ```db.env``` file in project's root:
```
POSTGRES_PASSWORD=postgres
POSTGRES_USER=postgres
PGUSER=postgres
```
4. Build it via docker compose:
  - Build:
  ```sh
  docker compose build
  ```
## Running
- Run:
```sh
docker compose up
```
- Rebuild and run:
```
docker compose up --build
```
## Developing
You can either build and run the whole project for testing or build a dev/test image.
### Front-end
1. Navigate to front directory:
```sh
cd front
```
2. Build the dev docker image:
```sh
docker build -t front -f Dockerfile.dev .
```
3. Run the dev docker container:
```sh
docker run -p 80:80 front
```
4. Make changes to the project, rebuild and rerun the container.
### Back-end
1. Navigate to back directory:
```sh
cd back
```
2. Build tests docker image:
```sh
docker build -t tests -f Dockerfile.test .
```
3. Run tests in a docker container:
```sh
docker run tests
```
4. See the test results, make changes to the code, rebuild and rerun the tests e.t.c.