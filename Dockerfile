FROM node:8

EXPOSE 80
EXPOSE 443

COPY backup /root/backup
COPY backend /root/backend
WORKDIR /root/backend
RUN npm install

ENTRYPOINT npm start