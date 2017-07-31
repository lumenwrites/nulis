module.exports = {
  output: {
    publicPath: '/',
    libraryTarget: 'commonjs2',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [
      'node_modules',
    ],
  },
  module: {
      loaders: [
	  /* 
          {
              test: /\.scss$/,
              loaders: ['css-loader', 'sass-loader']
          },
	  {
	      test: /\.css$/,
	      loader: 'style-loader!css-loader'
	  },
	  */
	  {
	      test: /\.(png|woff|woff2|eot|ttf|svg)$/,
	      loader: 'url-loader?limit=100000'
	  },
	  {
	      test: /\.json$/,
	      loader: 'json-loader'
	  },
    ],
  }
};
