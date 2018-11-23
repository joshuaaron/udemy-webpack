"Minimum Webpack Setup"
/* Adding an exclude property to our babel-loader
exclude: Do not try to apply babel to any file inside this directory


// Working with React and Babel
// After we have installed the appropriate loaders, we need
to also add react as a preset option in our babelrc file:
This will handle all jsx files from react.

We also need to make sure we test for jsx in our test regex.
*/
{
	"presets": ["env", "react"]
}


"Vendor Asset Caching"
/*
With code splitting, we are going to take all the code we are writing and seperating it from all
the vendor/3rd party code.

Our code:
Index.js
SearchList.js

Vendor Code:
React.js
Lodash.js
Other

Since our code base will be updated a LOT more than our bundle, we want users
to only have to download our changes, and not the unchanged vendor files

with code splitting and browser caching, on subqequent visits the browser can see
if the vendor code has already been downloaded with no changes and not have to download it
Only the bundle.js file.

*/


"Code Splitting inside webpack.config"
/*
Delete our entry string and create an object
We give key/value pairs for the name and the location

Next we want a NEW bundle seperate from our first one.
We create a bundle key with the same src/index for our code

Then we create a vendor key and pass an array of strings of all the
name of the library that we want to include in the seperate vendor file

We pass the npm module name we want split off


Last thing we have to do is update the ouput.
Instead of the single filename: bundle.js
We change it to filename: '[name].js'
As it replaces the key with the name from the entry object key.
*/

entry: {
	bundle: './src/index.js',
	vendor: VENDOR_LIBS
}
output: {
	path: path.join(__dirname, 'dist'),
	filename: '[name].js'
}

/*
----
Bundle.js filesize hasnt changed though, even though it creates a seperate vendor file.

The issue is our entry point of index.js is importing a lot of files 
Some are from npm modules (react, redux), some are from our application that we wrote

The code WE wrote we need and want that in our code.
Because our code depends on these modules like react, it grabs them and includes them
in the output bundle.

To make sure we dont get duplicate imports. We are going to use a plugin
called the common chunks plugin.

we do this via the plugins key.
*/
plugins: [
	new webpack.optimize.CommonsChunksPlugin({
		name: 'vendor'
	})
]

/*
What this does is tells webpack to look at the total sum of our bundle and vendor entry opoint
If any modules included in those trees are identical/copies
Pull them out and only add them to the vendor entry point.

This fixes all the double including like all our react/redux
in our bundle and vendor outputs
*/


"TroubleShooting Vendor Bundles"
/* Since we have splitted our code into two bundles, we also must remember
to include the new vendor bundle in our indedx.html file

Instead of having to manually change these files and make sure we change the files
we update the index file. We can add another plugin called HTMLWebpackPlugin

This plugin will replace/ make it obsolete to manually maintain
the script tags inside the index document.

npm -i --save-dev html-webpack-plugin

we add this to our plugins object and give it some config.
We will add a template property and a reference to a html template
If we dont provide a template, it wont know what the HTML setup we have setup in our file

So if we link it to our actual html document, it will make sure it uses that file for its template
Also, we can now delete the script reference to bundle.js as it will maintain it for us
when it generate the new html document in our dist folder.
*/

/*
Code splitting our vendor libraries out is because they dont get updated as much
So we can benefit from some caching from the browser
 


How the browser decides if its downloaded a file?
By default the browser looks at the file name of the file
If it has not changed, the browser will use the cached version.

The caching wont work the way we expect as our bundle file isn;t changing.

If you open dev tools in chrome, go to settinfs and scroll down to disable cache while DevTools is open.
So whilst developing, having this checked, we never get a cached version of our bundle.js file.

This is good for devs - not so much regular users

But we need to figure out bust our cache - Rename our bundle/vendor.js files
so the browser is really clear on when the file is changed.

This is a small tweek
In the output object, on the filename property we currently have
[name].js

There is another property we can reference that will help
uniquely identify eaxch file when its generated called the
Chunk Hash.

we add .[chunkhash] after [name].

This is a hashed string of characters/hash of the contents of the file.
*/
output: {
	path: path.join(__dirname, 'dist'),
	filename: '[name].[chunkhash].js'
}

/*
One other gotcha - one other setting we have to change
In the CommonsChunkPlugin

The gotcha - apart of this process, webpack doesnt really know when we've made a 
change to vendor. Very often if we change bundle.js / our app code. Webpack will
mistakingly think that our vendor file is updated as well.

To fix this we change the name of the name property to names,
and the value will now be an array. where the first entry is 'vendor' and the second
will be 'manifest'

This creates a 3rd js file in our output directory called manifest.js

Purpose is to better tell the browser, a little more understanding on whether or not 
the vendor file actually got changed.
*/
plugins: [
	new webpack.optimize.CommonsChunkPlugin({
		names: ['vendor', 'manifest']
	}),
]


"Cleaning Project Files"
/*
Everytime we rebuild our project, a new bundle/vendor file we be created
and added to our dist directory as the chunkhash gives us a new filename
Meaning we will have a ton of duplicates

We are going to modify our build script
install helper module named rimraf

npm install --save-dev rimraf

The purpose of this module handle inconsistencies in commands between windows and OSX
in OSX we have access to a command called rm
On windows that same command isn't available.

If we want operating system agnostic scripts, we can use packages like rimraf
that has the same effect the rm command has, but itll do the right thing
regardless of the OS. It is a compatibility module to clean up files

we will add a script to run this module in our package.json.

Also we will modify our build script so whenever we build, this is called
*/
"scripts": {
	"clean": "rimraf dist",
	"build": "npm run clean && webpack"
}


// ---------------------------------------------------------
"Webpack Dev Server"

/*
Used as our development server. 
Used for a client side application with 0 server side logic. 

Purpose is to act as an intermediary between our browser and our webpack output
We only have to start our server once, then its responsible for watching our project code
and auto rebuilding our project when one of our files change,
It only updates the individual js modules that are changed when we save our projects


- npm install --save-dev webpack-dev-server

- Add a command to our package.json file to instruct it to run WDS
"serve": "webpack-dev-server"

With this, it will watch our files and build our project - only updating the file 
you changed.
*/

"DEV SERVER GOTCHA"
/*
- When we run webpack dev server - it internally executes webpack, but it stops webpack
from saving any files to our projec directory. Nothing is saved to our harddrive
If you want a portable version of your app. The actual assets you HAVE to run webpack
by it self.
webpack-dev-server by itself those files are ONLY saved in memory.
NOT directly from our harddrive.
*/


"React Router with Codesplitting"
/* 
Use codesplitting around the subroutes in our Routes
*/
<Router history={hashHistory}>
	<Route path="/" component={Home}>
		<IndexRoute component={ArtistMain} />
		<Route path="artists/new" component={ArtistCreate} />
		<Route path="artists/:id" component={ArtistDetail} />
		<Route path="artists/:id/edit" component={ArtistEdit} />
	</Route>
</Router>

/*
This means by default we will always have a bundle.js with our Home and ArtistMain component
Then as the user navigates, we will add codesplitting to dynamically load up the ArtistsCreate
and other components and additional code for these components.

The refactor is replacing all the route logic.
In order to use codepslitting effectively with RR, we will move away from jsx and use 'plain routes'
This is what React Router does in the background

We will create a new object called componentRoutes.
Inside here will store the config that will mirror what is described by the JSX route structure
and turn it into a basic JS object.

We will add some default config to first show the home component, and then add in more that is
responsible for the rest of the routes.

First, Define the component to use and its path to use
Then to tell the home route to use the ArtistMain, we will add in a indexRoute property
that will be an object with component: ArtistMain.

Next, define some child routes.
Each child route will be an object tjhat will specify a path, and a getComponent function
The path is the path to use when we want to see this component


By default, RR assumes when you are trying to use it, you have already loaded up all the
diff components you want to show on the screen.
However, if we want to ASYNC load up the component, we can use this getCOmpoent func

It takes the args location, and cb
RR expects us to call cb, with our component AFTER we have loaded it up.

The logic inside the getComponent() will be to place our System.import() call
to dynamically load our component, then we will call cb with the component once its fetched

When System.import resolves (its a promise) we then call the callback function
with the module that got loaded.

The callback takes a first arg of an error object - if theres any error in loading.
Because we're in the .then we can safely assume there is no error.
So we can pass in null

The second arg, the code we care about id on the .default property - so pass in module.default

Once you've added all the child routes, we need to actually use this object now.
We can remove all the JSX inside the Router component. 
Add a routes property to the main Router and pass in the componentRoutes object

The last step is to remove all the import statements at the top, as they are now dynamically loaded
*/

const componentRoutes = {
  component: Home,
  path: '/',
  indexRoute: { component: ArtistMain },
  childRoutes: [
    { path: 'artists/new', 
      getComponent(location, cb) {
				System.import('./components/artists/ArtistCreate')
					.then(module => cb(null, module.default))
      }
		},
		...
  ]
}

return (
	<Router history={hashHistory} routes={componentRoutes} />
);


/*
What happens when we want to access a database, or any other server side capabilities.
How do we combine a NODE server with webpack and other useful tasks like database, auth


*/

// -------------------------------------------------------------------------------
"Deployment Options"
/*

Static Asset Providers:

Github Pages
Amazon S3
Digital Ocean
MS Azure
surge.sh

// ----------------------------------------
"Getting Production Ready"

Quick changes to Webpack:
- Designed to get our config inline with deployment based practices

*/
//1. Go down to plugins at the bottom
new webpack.DefinePlugin({
	'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
})
/*
There are several libraries in our project - mostly react that make use of this
NODE_ENV flag
Whenever react runs it looks for a window scoped variable of process.env.NODE_ENV
If it finds it this variable and === 'production' react will behave a little different
It wont do as many error checking procedures while it runs and renders your app.
In production it assumes you dont want as much error checking as you checked it in your
dev environment - before they get to production.

To make this global variable available. We make use of this DefinePlugin - 
used to define window scoped variables defined in our bundle.js files.

this process.env.NODE_ENV is talking about the node enviroment running on OUR machine
WE will set the correct variable for this when we build our project.


in our build script, before we run the script we will add:
*/
// in package.json:
"build": "NODE_ENV=production npm run clean && webpack"
/*
By adding this here, it makes sure when NODE runs our clean and webpack scripts. 
Webpack will be ran in the node environment of 'production'

If we build our project without defining this, then webpack will assume it isnt in
production


Change 2:
2) The webpack script in package.json in the build script

One additional switch we can pass to the webpack coommand
that is the -p 
tells webpack we want a production version of our output
When webpack runs in production mode, it will auto minify all our JS code
when it minifies our JS code, it will automatically compact our code and rename vars etc, remove dead space.

*/
// in package.json:
"build": "NODE_ENV=production npm run clean && webpack -p"
/*



*/