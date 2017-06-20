const webpack = require('webpack'); 

function getPlugins() {
    const plugins = [];

    if (process.env.NODE_ENV === "development") {
	plugins.push(new webpack.DefinePlugin({
	    'process.env.NODE_ENV': JSON.stringify('development')
	}));
    }
    if (process.env.NODE_ENV === "production") {
        plugins.push(new webpack.DefinePlugin({
	    'process.env': {
		NODE_ENV: JSON.stringify('production')
	    }
	}));
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
	path: __dirname + '/dist/',
	publicPath: '/',
	filename: 'bundle.js'
    },
    devServer: {
	historyApiFallback: true,
    },
    module: {
	loaders: [
	    {
		exclude: /node_modules/,
		loader: 'babel-loader',
		query: {
		    presets: ['react', 'es2015', 'stage-1'],
		    plugins: ["transform-decorators-legacy"]		    
		}
	    },
	    {
                test: /\.scss$/,
                loaders: ['style-loader', 'css-loader', 'sass-loader']
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
    plugins: getPlugins(),
    resolve: {
	extensions: ['.js', '.jsx']
    },
};
