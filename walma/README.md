[![Travis status](https://secure.travis-ci.org/opinsys/walma.png)](http://travis-ci.org/#!/opinsys/walma)

# Walma - Collaborative Whiteboard

Walma is a collaborative whiteboard tool written with Node.js and CoffeeScript.

http://walma.opinsys.fi/



# Installing

Install Node.js 0.6.x and MongoDB (tested with 2.0.x)

TIP: Run the MongoDB in a docker container. In the mongodb directory there are scripts to build and run MongoDB. After its running you should update the config.json mongoHost property to reference the ip address of the docker container.

    git clone git://github.com/opinsys/walma.git
    cd walma

Install dependencies

    npm install

Setup database

    bin/setupdb


Production run

    npm start


And point your browser to http://localhost:1337

# Hacking

Development run

    bin/develop

Tests

    npm test


# Copyright

Copyright © 2010 Opinsys Oy

This program is free software; you can redistribute it and/or modify it under
the terms of the GNU General Public License as published by the Free Software
Foundation; either version 2 of the License, or (at your option) any later
version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with
this program; if not, write to the Free Software Foundation, Inc., 51 Franklin
Street, Fifth Floor, Boston, MA 02110-1301, USA.


