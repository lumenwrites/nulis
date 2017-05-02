FROM node:latest
MAINTAINER Ray ALez <raymestalez@gmail.com>

# Setup environment variables containing paths
ENV HOMEDIR=/home
ENV PROJECT_DIR=/home/nulis
ENV CLIENT_DIR=/home/nulis/client
ENV SERVER_DIR=/home/nulis/server

# Copy project files into /home/nulis folder.
RUN mkdir -p $PROJECT_DIR
WORKDIR $PROJECT_DIR
COPY . .

# Install npm modules
RUN npm install --production

# Port to expose
EXPOSE 3000

CMD npm run serve
