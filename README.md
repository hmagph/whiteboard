Press this button, to get your own copy of the matisse whiteboard running in Bluemix !

[![Deploy To Bluemix](https://bluemix.net/deploy/button.png)](http://bluemix.net/deploy)

The matisse whiteboard by Imaginea is a cooperative drawing application where whiteboards can be shared and are saved to a database. Users log in using their Google+ or Twitter accounts. Google authentication is done through the Bluemix SSO service.

The whiteboard can be found in the matisse directory. It is a fork of https://github.com/Imaginea/matisse with some additional updates including the use of Bluemix SSO. 

++How to Run this app locally

1) To run this application you need to install node.js and also install npm.

2) Install Redis Server

a. for windows redis exe https://github.com/dmajkic/redis/downloads

b. for ubuntu use - sudo apt-get install redis-server

3) Install all node module dependencies for matisse using -

$npm install -d  

4) Add the following line to "hosts" file

127.0.0.1 thematisse.org  

5) Change the "localhost" to your local machine ip in public/javascripts/matisse/matisse.setup.js

var socket = io.connect('http://localhost'); //change it to server ip or local ip for testing from other machines  

6) Everyauth package has been included in the git repository since the original everyauth package version 0.2.28 contains the deprecated url for twitter.

7) Then you can run

$ node app.js  
in the root folder.

Now you can open the http://thematisse.org:8000/ to open the matisse home page.

++Run this app using the redis cloud service on bluemix

You can connect your local deployment to the redis cloud service on bluemix and tap into your live db. This is more of a suggestion for testing and development and not suggested for a production db.

Bind your redis service to your application (the 25MB version is free)
-In your bluemix dashboard click on the 'Add a Service or API' button, under 'Services'  
-Select 'Redis Cloud'  
-For the space, select your app's space and for the app itself you can select your app or 'Leave Unbound'  
-Click 'Create'  
-If you selected 'Leave Unbound' you will have to go to your dashboard, click on your app, then click on the 'Bind a Service or API' button, and select the Redis Cloud service and click 'Add'.  

With the Redis service bound to your app, you can get the login credentials by clicking on the 'Show Credentials' drop down bar at the bottom of the service's panel. Note you have to be in the app view (by clicking on the app in your dashboard) to be able to view credentials for any service. You can now use the credentials

Links to bluemix docs on binding a service to your app and using redis:  
https://www.ng.bluemix.net/docs/services/reqnsi.html#accser_external  
https://www.ng.bluemix.net/docs/services/Redis/index.html  

++Dev environment setup & pipeline  
The dev environment used for this app requires an editor of your choice, nodejs and the npm (node package manager) and git.

In order to deploy it directly (not through the pipeline) you will need the cloud foundry cli and the IBM containers extension (the latter only if you are using containers). Info on setting these up can be found here: https://www.ng.bluemix.net/docs/starters/index-gentopic3.html#container_ov

The pipeline for this project has 4 stages. Two of them build and deploy to cloud foundry and the other two build and deploy to containers. This is done as a demonstration and is not necessary. Generally, people choose one or the other, but this is a concise example of how to do these kinds of deployments. Granted that for the container deployment a docker file is required (one is provided in the repository).

Build CF:  
Input - SCM Repository (our git repo master branch)  
Jobs - Build type that goes into the matisse directory and makes an archive directory to pass our build result to the next stage, then tars and zips the contents into the archive directory with the directory name 'whiteboard'.  
The build step can pass files to the next stage through a predefined directory (in our case matisse/archive).  

Deploy CF:
Input - The job output from the Build CF stage (the stuff in our archive folder)  
Jobs - Deploy type where we specify that we want a cloud foundry application, we select the organization and space and give it an application name of our choice. You can create an empty NodeJS app in bluemix and give it the same name as the application name in the pipeline. The pipeline will deploy into this empty app with the same name.

Build Container  
Input - The SCM repository like in the Build CF stage but we use the last stage's completion to trigger this one.  
Jobs - Here we leave the defaults and simply set our organization and space. This stage runs the default build script which builds the image based on our docker file.  

Deploy Container  
Input - The build stage's files, our image.  
Jobs - Deploy uses the default 'red/black deploy' strategy which keeps the currently running container running (if there is one) if the deployment fails. Here we have to set the port that the application runs on (the port is not entered in the URL when the container is live, like we do when running in the dev environment).  

The deployscript used right now is a fork of the standard deploy script. https://github.com/estesp/deployscripts is used because of it's added 'INJECT_' feature. This allows us to create environment variables that can be used within the whiteboard app. The functionality is planned for the standard deploy script at some point. The current script is located here: https://github.com/Osthanes/deployscripts.git.

We chose to use container groups so in the deploy script we had to comment the default single container deployment and uncomment the container group deployment:

\# Deploy Container Group (optionally define ROUTE_HOSTNAME, ROUTE_DOMAIN, BIND_TO, DESIRED on the environment)

\# IF YOU WANT CONTAINER GROUPS .. uncomment the next line, and comment out the previous deployment line (/bin/bash deployscripts/deploygroup.sh)  
export BIND_TO=Whiteboard-Container  
export ROUTE_HOSTNAME=containerwhiteboard  

\# Need to use the INJECT_ prefix to have the env vars passed into the container for the app use
export INJECT_CONTAINER_HOSTNAME=${CONTAINER_HOSTNAME}
/bin/bash deployscripts/deploygroup.sh 

Environment variables - Our app requires knowledge of its URL. For this reason we created the CONTAINER_HOSTNAME env var and set it to ROUTE_HOSTNAME (which will be the hostname for the app followed by .mybluemix.net) and the INJECT_CONTAINER_HOSTNAME which is the env var used in the application. The script strips the 'INJECT_' portion and creates the env var in the container.
BIND_TO is used to bind to our application which contains the bound Bluemix services such as the Redis Cloud and Single Sign On services. This is how we can expose the VCAP_SERVICES environment variable to our application running in the container.
