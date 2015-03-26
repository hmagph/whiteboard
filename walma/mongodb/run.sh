#! /bin/bash
docker run -d --name walma_mongodb -p 27017:27017 walma_mongodb
export MONGODB_IP=`docker inspect -f '{{.NetworkSettings.IPAddress}}' walma_mongodb`
echo "MONGODB IP address : $MONGODB_IP"
