# Builds a container with the Matisse whiteboard node.js app running

# Use the ibmnode image (node.js is preinstalled)
FROM  registry-ice.ng.bluemix.net/ibmnode:latest

# Add the app
ADD ./matisse /matisse
# Install dependencies
RUN cd /matisse && npm install -d

WORKDIR /matisse

ENTRYPOINT ["node", "app.js"]