const webpack = require('webpack'); 

function getPlugins() {
    const plugins = [];

    plugins.push(new webpack.DefinePlugin({
	'process.env.NODE_ENV': JSON.stringify('desktop')
    }));
    
    if (process.env.NODE_ENV === "production") {
        plugins.push(new webpack.optimize.UglifyJsPlugin({
	    minimize: true,
	    output: {
                comments: false
	    },
	    compressor: {
                warnings: false
	    }
        })); 
    }

    return plugins;
}

module.exports = {
    entry: [
	'./index.js'
    ],
    output: {
	path: __dirname,
	publicPath: '/',
	filename: './dist/bundle.js'
    },
    module: {
	loaders: [
	    {
		exclude: /node_modules/,
		loader: 'babel',
		query: {
		    presets: ['react', 'es2015', 'stage-1'],
		    plugins: ["transform-decorators-legacy"]		    
		}
	    },
	    {
		test: /\.scss$/,
		loaders: ['style', 'css', 'sass']
	    },
	    {
		test: /\.css$/,
		loader: 'style-loader!css-loader'
	    },
	    {
		test: /\.(png|woff|woff2|eot|ttf|svg)$/,
		loader: 'url-loader?limit=100000'
	    },
	    {
		test: /\.json$/,
		loader: 'json-loader'
	    },
	    {
		test: /\.nls/,
		loader: 'raw-loader'
	    }	    
	]
    },
    resolve: {
	extensions: ['', '.js', '.jsx']
    },
    plugins: getPlugins(),
    devServer: {
	historyApiFallback: true,
	contentBase: './'
    }
};
