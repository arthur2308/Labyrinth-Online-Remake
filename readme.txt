Here is the basic layout.

client contains the client code in the form of a chrome extension.

server contains the node.js server code

package management is provided by npm. The package.json outlines the packages that are used by the project. After your initial clone of the repo just run the following command in the directory where package.json is

npm install

this will install all dependencies and get everything setup.

build/integration is managed by gulp. Gulp likes to be installed globally so run the following command once.

npm install --global gulp

if that fails try

sudo npm install --global gulp

to build just type gulp

gulp

there is also a watch feature. To start run gulp with the watch parameter

gulp watch

this will watch all your js files and run jslint on them as soon as they are saved.

To run, start the server with the following command

node index.js

To launch the client, you need to install the extension in chrome with these steps.

* goto chrome://flags
* find "Experimental Extension APIs" and click its "Enable" link
* restart chrome
* goto chrome://extensions
* check Developer mode check box at top 
* click "Load unpacked extension..." button and navigate to client directory. Chrome will see the manifest.json and do the rest.
* click the launch link to launch the client

Helpful pages

https://developer.chrome.com/apps/first_app
https://www.safaribooksonline.com/library/view/programming-chrome-apps/9781491905272/ch04.html
http://www.hacksparrow.com/tcp-socket-programming-in-node-js.html
