import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { browserHistory } from 'react-router';

/* Actions */
import * as treesActions from '../actions/trees.actions';

/* Utils */
import handleScroll from '../utils/handleScroll';

class TreeManager extends Component {
    componentDidMount(){
	this.props.listTrees();
    }

    renderTreeList() {
	var { allTrees } = this.props;
	if (!allTrees) { return <div></div> }
	
	var treeList = allTrees.map((t)=>{
	    var capitalized = t.name.charAt(0).toUpperCase() + t.name.slice(1);
	    return (
		<div key={t.slug} className="tree">
		    <Link to={"/tree/"+t.slug}>
			{capitalized}
		    </Link>
		    <a className="right"
		       onClick={()=>this.props.deleteTree(t)}>
			<i className="fa fa-trash"></i>
		    </a>

		</div>
	    );
	});
	var newTree = [
	    <div key="new" className="tree">
		<Link to="new">
		    <i className="fa fa-plus"></i>
		    New Tree
		</Link>
	    </div>
	]
	return newTree.concat(treeList)
    }
    render() {
	return (
	    <div className="trees">
		{this.renderTreeList()}
	    </div>
	);
    }
}

function mapStateToProps(state) {
    return {
	allTrees: state.allTrees
    };
}

export default connect(mapStateToProps, treesActions)(TreeManager);
    
