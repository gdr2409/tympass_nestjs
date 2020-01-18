FROM alpine:latest
RUN apk add --no-cache nodejs npm
WORKDIR /tympass
COPY . /tympass
RUN npm install 
EXPOSE 3002
ENTRYPOINT ["npm"]
CMD ["run", "start"]
