FROM node:18-alpine

# Install Git inside the container
RUN apk update && apk add --no-cache git

# Set the working directory
WORKDIR /app

RUN git clone https://github.com/imdeeep/kuvaka-tech-task .

# Install dependencies
RUN npm install

# Expose the port and set the start command (same as before)
EXPOSE 3000
CMD [ "node", "index.js" ]