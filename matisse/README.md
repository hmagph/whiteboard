# A shared white board

### About

This is a express.js app with socket.io plugin.

Currently, the server only acts as a message broadcaster, i.e. it receives a message from the client and sends it out to all other clients.

### Client API
The com.js library provides for an abstraction over the internal messaging API.

It has one method 'sendDrawMsg' to send data from the client. To receive data you must implement matisse.onDrawEvent.

See the views/index.jade for example written in [jade](http://jade-lang.com/) templating engine.

See index.html in this directory for a vanilla html example.

### How to Run this app?
1) To run this application you need to install [node.js](http://nodejs.org) and
   also install npm.

2) Install Redis Server

>
>   a. for windows redis exe https://github.com/dmajkic/redis/downloads
>
>   b. for ubuntu use - sudo apt-get install redis-server
>
>

3) Install all node module dependencies for matisse using -

>
>   $npm install -d
>

4) Add the following line to "hosts" file

>
> 127.0.0.1		thematisse.org
>

5) Change the "localhost" to your local machine ip in public/javascripts/matisse/matisse.setup.js

>
> var socket = io.connect('http://localhost'); //change it to server ip or local ip for testing from other machines
>

6) Everyauth package has been included in the git repository since the original everyauth package version 0.2.28 contains the deprecated url
for twitter.

7) Then you can run

>
> $ node app.js
>

in the root folder.

Now you can open the http://thematisse.org:8000/ to open the matisse home page.

