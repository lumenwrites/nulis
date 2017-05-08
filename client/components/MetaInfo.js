import React, { Component } from 'react';
import { connect } from 'react-redux';

/* Vendor Components */
import MetaTags from 'react-meta-tags';
import removeMd from 'remove-markdown';

class MetaInfo extends Component {
    render () {
	const { tree } = this.props;

	var title = "Nulis";
	if (tree.name) {
	    title = tree.name + " - Nulis";
	}
	const description = removeMd(tree.cards.children[0].content).substring(0,120);	
	
	return (
            <MetaTags>
		{/* Main */}
		<title>{title}</title>
		<meta name="description"
		      content={description} />
		{/* Facebook */}
		<meta property="og:title" content={title} />
		<meta property="og:description" content={description} />	
		{/* Twitter */}
		<meta property="twitter:description" content={description}/>
            </MetaTags>
	);
    }
}


function mapStateToProps(state) {
    return {
	tree: state.tree.present
    };
}

export default connect(mapStateToProps, {})(MetaInfo);

