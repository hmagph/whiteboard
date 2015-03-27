# Builds a container with the Matisse whiteboard node.js app running
FROM  ubuntu:latest
RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get -y install \
        nodejs \
	npm \
	redis-server \
        curl \
        wget \
        unzip 

RUN npm install -g express
RUN npm install -g express-generator

# link necessary since some things expect node
RUN ln -s /usr/bin/nodejs /usr/local/bin/node
# link gmake too
RUN ln -s /usr/bin/make /usr/bin/gmake

# build the custom sampler for jmeter & clear results directory
ADD . /matisse
RUN cd /matisse && npm install -d

ENV REDIS_HOST localhost
ENV REDIS_PORT 16689
ENV REDIS_PASSWORD set_me

WORKDIR /matisse
CMD nodejs app.js


