/* Entry Script */

if (process.env.NODE_ENV === 'production') {
    // In production, serve the webpacked server file.
    require('./dist/server.bundle.js');
} else {
    // Babel polyfill to convert ES6 code in runtime
    require('babel-register')({
	"presets": ["react", "es2015", "stage-2"],
	"plugins": [
	    [
		"babel-plugin-webpack-loaders",
		{
		    "config": "./webpack.config.babel.js",
		    "verbose": false
		}
	    ]
	],
    });
    require('babel-polyfill');

    require('./server');
}
