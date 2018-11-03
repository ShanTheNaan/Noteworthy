FROM node:8

EXPOSE 80
EXPOSE 443

RUN apt-get update

RUN npm install -g @angular/cli

COPY frontend /root/frontend
COPY backend /root/backend

WORKDIR /root/backend
RUN npm install

WORKDIR /root/frontend/Noteworthy
RUN npm install
ENTRYPOINT ng serve --port 8080 & npm start --prefix /root/backend