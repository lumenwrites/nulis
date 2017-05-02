import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { browserHistory } from 'react-router';

/* Actions */
import * as actions from '../actions/index';


class Trees extends Component {
    constructor(props){
	super(props);
    }

    componentDidMount(){
	this.props.listTrees();
    }

    renderTreeList() {
	var { allTrees } = this.props;
	/* console.log(allTrees);*/
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
		<a onClick={()=> {
			this.props.loadTemplate('Blank');
			browserHistory.push('/new');
		    }}>
		    <i className="fa fa-plus"></i>
		    New Tree
		</a>
	    </div>
	]
	return newTree.concat(treeList)
	/* return treeList;*/
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
	allTrees: state.allTrees,
	authenticated: state.profiles.authenticated
    };
}

export default connect(mapStateToProps, actions)(Trees);
    
