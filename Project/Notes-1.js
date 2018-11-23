/***************************************************
// -----------------------------------------
// WEBPACK UDEMY COURSE

Why use a build tool?
Server Side Templating - Legacy style of creating web apps, and showing HTML docs to users.
Back end server creates an HTML document and sends it to the user
This is a fully rendered HTML page with inputs, buttons, images etc

User visits page => HTTP request to server => new HTML document => User clicks a link
=> HTTP request to server => new HTML document


Single Page App - Server sends a bare bones HTML doc to the user, Once loaded, 
It goes and grabs a couple of JS scripts. Javascript is then responsible to assemble the full webpage.

User visit page => HTTP request to server => New HTML doc => Front end framework boots up, assemble 
some amount of HTML on the page => user clicks link => FE framework shows new content.


In a SST world, we rely on a server to put together a HTML doc.
in a SPA, we rely on a big pile of JS code on the users machine to put together a HTML doc. 
This is the much more preferred method of serving a webpage.

- Amount of js code in a SPA is 1000x more than a Server Side rendered page.
When there is a lot of JS tied to a single application, we need to be able to modularise 
everything and have seperate files. When you have a large project and only a few small files, it becomes impossible to navigate etc.

To address this, the idea of Javascript Modules was born
JS Modules is a single JS file that contains some small amount of code.
The benefit of this is it becomes a lot more clear where code is kept and oragnised.

-Problems of multiple files
The problem of seperating all these files however, we need to think about the order of how our code is executed. 
Some files may rely on code from other files. A particular load order is important for every time we run our application.
Loading a lot of files over a HTTP request as well is a bad idea from a performance stand point - especially on a mobile device.


- The purpose of Webpack
Its main core focus is to take our big collection of JS modules and merge them into one big JS file, 
ensuring each module is executed in the correct order.

It also can handle other types of files and transpiling code and lots more as an extra benefit.

// ---------------------------------------------------------------------
// JS Module Syntax

When a file is required for another file to run - Lets say a file that runs a function
that adds two numbers, a file that uses this function to display it to the page.
The latter requires this file.
This file needs to be 'imported' into the other file.

Code that we want to access in one file, is not inheritly accessible via other files as they have
their own scope. To get access, we must form an explicit link between the two files.

To form this, we need to learn about how JS modules behave.
There are different rulesets for determining how JS modules behave depending on the
environment you're working in (node, browser etc);

---------------------------------------------
MODULE SYSTEM    |    COMMON SYNTAX
                 |
CommonJS         |  module.exports + require
                 |
AMD              |  define + require
                 |
ES2015+					 |  export + import			 


Just 3 of the several different module systems.
These are the rules and syntax we will use to link files (and most common)

CommonJS - implemented by NodeJS. 
AMD - Asynchronous Module Defintion - More used in FE applications.
ES2015 - Direction most of JS is headed as it is native spec built into JS.
*/

// sum.js - no dependancies. 
const sum = (a, b) => a + b;

module.exports = sum;
export default sum // export sum

// index.js - needs function from sum.js
const sum = require('./sum');  // pass in relative path reference.
import sum from './sum'        // es6 import


// -------------------------------------------------------------------------------
"Installing Webpack"

/*
We will need to download webpack first
npm install --save-dev webpack    

Next, we need to create a file to customise how webpack behaves when it runs 
inside of our project. We need to instruct it on which files to join together.

This is done inside a file usually called webpack.config.js

When webpack runs - it will auto look for a file with this exact name
inside our directory.

There are two pieces of configuration needed at a minimum to get it
to run properly in our project.

*/
"ENTRY PROPERTY"
/*
- One is the entry property.
The file that acts as the root file of your application (usually called index.js)
that runs your application, we would refer to it as the entry point of our app.

So by telling webpack this is the entry file, it will tell webpack that it is the 
first file it should execute in the browser.

Secondly, it forms the start of the module building process, 
it will look at what files it imports, and all the files those import etc.

Use a relative path from the webpack.config file.


*/

"OUTPUT PROPERTY"
/*
- The second piece needed is the output property.
Tells webpack where to place this big bundled file from all our JS modules and
where to save it to and what to name it.

Output is an object with a few nested properties inside.
path - Reference to the directory to where the output file should be saved to
filename - What webpack should call the file that is created. (bundle.js convention)

Path MUST specify an absolute reference path (entire file path on your harddrive)

To generate this path, we will use a helper from NodeJS called the path module.
*/
const path = require('path');

/*
When we run webpack it runs in the Node JS environment so we can use any 
piece of NodeJS tech

Path has a function called resolve that takes in a path to a file and makes sure the 
path is correctly specified no matter what operating system it is run on (windows, OS, linux)

__dirname - constant in nodejs, reference to current working directory.

So whenever webpack runs, save the file 'bundle.js' inside of a path of our project directory
in a folder called build.
*/

const path = require('path');
const config = {
	entry: './src/index.js',
	output: {
		path: path.resolve(__dirname, 'build'),
		filename: 'bundle.js'
	}
};

module.exports = config;


// ----------------------------------------------------------------
"Global modules vs Local modules"
/*

We can now add a script in our package.json file to run webpack in our project.
Important to have double quotes everywhere
*/
"scripts": {
	"build": "webpack"
}
/*
When you install webpack globally and run webpack in the command line, your computer will 
look at all your global modules it will find one called webpack and run it.
On the other hand when you install webpack locally to your project, when we create the build script.
rather than looking to the global node modules in our computer, it will run webpack locally

When you install a module globally, you can only have one version of a module installed at a time
So, if we wanted to make sure maybe one project used webpack v2 and the other used webpack v3 we would have trouble
juggling these versions using globally installed modules.
This is solved by local modules, and we use these local modules by calling the script inside the 
package.json file.

*/
// ---------------------------------------------------------------------
"Introduction to Module Loaders"

/*
Loaders are used to do some pre-processing on files before they are added to our bundle.js file
Loaders are commonly used to transpile code from ES6 => ES5, handle images, SASS => CSS etc

First loader we'll use is Babel:
Babel is used to transpile next generation javascript down to ES5 that all browsers can understand


To set up babel, we need to install 3 modules to get it work.

babel-loader: teaches babel how to work with webpack. Compatibility layer.
babel-core: knows how to take in code, parse it, and generate some output files.
babel-preset-env: Ruleset for telling babel exactly what pieces of ES2015/6/7 syntax
to look for, and how to turn it into ES5 code. 
*/
npm install --save-dev babel-core babel-loader babel-preset-env
/*
Loaders can handle any type of file we wish, but sometimes it only makes sense for
one type of file - for example, we wouldn't use babel to transpile a css file.
We can specify which type of files these loaders will handle.


Inside the webpack config, we will add a new property called module.
Each individual loader is referred to as a rule.
Because we can have many different rules/loaders, we define this as an array.
Inside, we will add an object to designate our first rule/loader.

The first property we will define is called 'use' and it tells webpack what loader 
we want to use. here we set 'babel-loader'

The next property we will define is called 'test'
Test gets assigned a regex expression. Any regex we pass to this test property
will be taken by webpack and be applied to the file name of every file we import into our project

If the file ends in the test case given, babel will be applied to these files.
This is how we ensure babel only handles a certain type of file.
*/
// webpack.config.js
module: {
	rules: [
		{
			use: 'babel-loader',
			test: /\.js$/,
		}
	]
}

/*
Lastly, we need to tell babel once its operating, that it knows what it is meant to do tothese files.
This is where the preset library kicks in.

We define how it works we will create a new file called .babelrc in our root directory
Inside, we define an object with the property presets and specify the env library we added
*/

// .babelrc
{
	"presets": ["babel-preset-env"]
}


// --------------------------------------------------------------------
"Refactor to ES2015 Modules from CommonJS"
/*
So far, we have been importing with the use of require statements and exporting code
with the module.exports statements.
With ES2015, we now import with the import keyword and export with the export keyword!
*/
import sum from './sum';
export default sum;



// --------------------------------------------------------------------
"Handling CSS with Webpack"
/*

We have created a file for styles for our project. Our first step is to import those
styles into our project. 
We created a file that is relevant to the styles so we will import it there
*/

// image-viewer.js
import '../css/image-viewer.css';

/*
It is important to specify the extension if it is not a JS file.

Now it is time to set it up in webpack and recognise the css file.
We will need a few new modules:
style-loader and css-loader.

css-loader: teach webpack how to import and parse css files.
style-loader: takes css imports and adds them to the head section
of the HTML document.

We can specify multiple loaders in a single step.
We do this via adding them into an array. 

The order is very important, webpack reads loaders right to left.
*/

module: {
	rules: [
		..,
		{
			use: ['style-loader', 'css-loader'],
			test: /\.css$/,
		}
	]
}

/*
The only problem with this setup, is that it will generate your css and 
place it in a style tag inside the head element of your document and not a seperate file.

Loading CSS in a seperate file is a lot faster than loading all our js and css in a single file 
with how the browser handles parallel download requests.
There is a way though we can seperate this out to it's own file (as it should be)
*/

"The Extract Text Webpack Plugin"
/*
This plugin will take a reference to a loader, run webpack with it
and take any text that was generated by that loader and save it in a seperate file 
in our output directory.

It is wired up a little differently.
First we will require the plugin at the top.

Next we will update the css section and remove the use section.
we define 
*/
loader: ExtractTextPlugin.extract({
	loader: 'css-loader'
}),

/*
Plugins work a little outside the webpack pipeline and can keep files from ending
in the bundle.js output. We want a seperate file rather than each css file stuffed into
the final output.

One last bit of config, we need to add a new property to our main config object.
It is  called plugins.
Define an array and state 
new ExtractTextPlugin('style.css');

This line tells the library to find any files that were transformed from it's loader,
defined in the it's earlier definition. THen it will save it into a file named 'style.css'
This is what creates a seperate file for us.

We can now add this file into our index.html to reference it in our project
<link rel="stylesheet" href="build/style.css">

*/
// --------------------------------------------------------------------
"Handling Images with Webpack"
/*
We are relying on an external source to load our image currently.
which can be unreliable and slow. 
It would be much quicker if we hosted the image locally ourself and included
that image in our build pipeline.

We can do this with:

image-webpack-loader: 
  Compress the image for us

url-loader:
  If the image is small(kb): Include the image in bundle.js as raw data that the image consists of
  If the image is big: Include the raw image in the output directory.

File loader is also required just to run with url-loader now.

npm install --save-dev image-webpack-loader url-loader file-loader


Next we create a new rule again.
First thing is add the test property - to check for filenames
*/

test: /\.(jpe?g|png|gif)$/,

// Now we'll tell webpack what to do via the loaders.
use: [
	'url-loader',
	'image-webpack-loader'
]
/*
Remember order matters, it reads right to left.

We are also going to add some options into url loader with some custom configuration.
We want to specify what size image will be small eenough to include as raw data or too large to be 
added seperately.
To do this, instead of using the string name for the loader whilst declaring multiple loaders,
we will replace it with an object with the loader key, and an options key that is an object. 
We will then give that optionsobject the key of limit, This is the file size limit. 

It will look for any image greater than this value, save it as a seperate file otherwise if it's smaller,
include it into our bundle.js output
*/

use: [
	{
		loader: 'url-loader',
		options: { limit: 40000 }
	},
	'image-webpack-loader'
]


// --------------------------------------------------------------------
"Importing Local Images with Webpack"

/*
In our root folder directory,  we are creating a 'assets' folder to store our images
We will save a large (110kb) and small (10kb) image in this folder
These are for going below and above the limit threshold we set in url options object.

We are then importing them into our JS file with a relative path
*/
import big from '../assets/big.jpg';
import small from '../assets/small.jpg';

/* 
Now we have imported but what are these variables

The variable small is the actual base64 string - the actual data representation of the image
We can replace our current image.src link of an image to this variable
*/
const img = document.createElement('img');
img.src = small;

/*
If we do the same however for the big image that isn't a base64 and inlined in our bundle,
we get an error that it is referencing the wrong directory for the image
It is currently trying to find it in our js-modules (base) directory,
when in reality we need it to look in our build folder

We don't know if the big variable is going to be a regular image added seperately or a datauri image
so we can't prepend 'build/' in front of our big variable
...
*/

// --------------------------------------------------------------
"Public Paths"
/*
In the output section in our webpack config,
we are going to add a publicPath: 'build/' 

The publicPath property:
It is used by ANY loader that generates a direct file path reference to a file in our output directory

when URL Loader takes our image from our dev folder to our build folder,
When this happens, the loader goes to where that file is imported and assigns the name of the new image in the build directory to the variable.

if we define the output.publicPath, URL Loader will take that property/ that string and prepend it to the url that
gets passed back from the import statement.

This is how it finds the 'build/' directory to properly locate the image.
*/

const config = {
	entry: './src/index.js',
	output: {
		path: path.resolve(__dirname, 'build'),
		filename: 'bundle.js',
		publicPath: 'build/'
	}
}

// --------------------------------------------------------------------
"Code Splitting"
/*
What is it?

Imagine a page of a login screen and the other with heaps of charts
There would be a significant less amount of JS code for the login compared to the main page

The idea would be only load the minimum amount of JS necessary to show the form page
Once the user logs in, load the rest!

Code splitting, webpack allows us to split up our main bundle.js into seperate individual files
then programmaticaly decide when to load up different pieces of our bundle inside of our code base


How do we do it?

Example: 
index.js - entry point will render a button with a click handler
that imports 'image_viewer.js' after button gets clicked.
image_viewer.js - Renders an image.

So on the home page, only index.js will be loaded.
Not until the button is clicked, then both js files will be loaded.


System.import is a function apart of ES2015 spec.
When called, we pass in the name of the module we want to import
The browser will then reach out to the server and try to find that module.
Then when found, it will send it back to the client, we then have the oppurtunity
to execute any code inside that file.

System.import is only grabbing a single module call, any import statement INSIDE that module,
will also pull in those modules along with it, available to execute.

When we call System.import, we request code from our server which is an async call.
That means System.import returns a promise.

--- UPDATE ---
We can now just use the import() function for dynamic importing with some transpiltation
It works the same and returns a promise.

To then get access to it, we can add on a .then(module => {})
and have access to that module inside the callback
or save the result and await it in an async function

* Babel will need the Syntax Dynamic Import plugin for this.

npm install --save-dev babel-plugin-syntax-dynamic-import
*/

// .babelrc 
{
	"plugins": ["syntax-dynamic-import"]
}

button.onclick = () => {
	import('./image-viewer')
		.then(module => {
    	return module.default();
  	}).catch(err => {
    	console.log('chunk loading', err);
  	});
};

/*
Default will be a property available as the function we exported from the image_viewer file

*/
