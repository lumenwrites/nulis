import React, { Component } from 'react';
import { connect } from 'react-redux';

import { browserHistory } from 'react-router';
import { Link } from 'react-router';

/* Vendor Components */
import FileReaderInput from 'react-file-reader-input';

/* Actions */
import * as treesActions from '../actions/trees.actions';
/* Utils */
import { getCard } from '../utils/cards';
import handleScroll from '../utils/handleScroll';


class MenuTree extends Component {
    constructor(props){
	super(props);

	this.renderTemplatesList = this.renderTemplatesList.bind(this);	
    }

    componentDidMount(){
	/* Shortcuts */
	Mousetrap(document.body).bind(['ctrl+s'], ()=>{
	    this.saveFile();
	    return false;
	});
	Mousetrap(document.body).bind(['ctrl+o'], ()=>{
	    this.refs.openFile.click();
	    return false;
	});
	Mousetrap(document.body).bind(['alt+n'], ()=>{
	    this.props.loadTemplate('Blank');
	    return false;
	});

    }

    renderSaveOnline() {
	var {user} = this.props;
	var {source, author} = this.props.tree;
	var atMyTrees = this.props.location.pathname == "/trees";

	console.log("Source " + source);
	console.log("Tree's Author " + author);
	console.log("User " + user.email);		

	/* Hide the button when at my trees, or not authenticated. */
	if (!this.props.tree || atMyTrees || !user)  { return null; }
	/* Or if I'm the author and it's in the db, so I'm autosaving it anyway.*/
	if (source == "Online" && author == user.email) { return null; }

	/* If it's a template, a file, or not my tree -
	   show the button so I could create a new tree in my db. */
	if (source == "Template" || source == "File"
	    || (source == "Online" && author != user.email)) {
	    return (
		<li key="saveonline">
		    <a onClick={()=>
			this.props.createTree(this.props.tree) }>
			<i className="fa fa-cloud"></i>
			Save to My Trees
		    </a> 
		</li>
	    )	
	}
	console.log("If I've covered all the cases, this should never happen.");
    }


    renderTemplatesList() {
	var templates = ['Story'];
	templates = templates.map((t)=>{
	    return (
		<li key={t}>
		    <Link to={"/template/"+t}>
			{t}
		    </Link>
		</li>
	    );
	});
	var hr = [ <hr key="hr-templates"/> ]
	return templates;
    }
    

    render () {
	const { user } = this.props;
	const atMyTrees = this.props.location.pathname == "/trees";
	const isDesktop = window.__ELECTRON_ENV__ == 'desktop';

	return (
	    <span className="dropdown">
		<a className="btn">Tree</a>
		<ul className="dropdown-menu">
		    <li key="new">
			<a onClick={()=> {
				this.props.loadTemplate('Blank');
				browserHistory.push('/new');
			    }}>
			    <i className="fa fa-plus"></i>
			    New Tree
			</a>
		    </li>
		    {this.props.user?
		     <li key="trees" className={(atMyTrees ? "hidden":"")}>
			 <Link to="/trees">
			     <i className="fa fa-th"></i>
			     My Trees
			 </Link>
		     </li>
		     : null}
		{this.renderSaveOnline()}
		<li key="open">
		    <a  onClick={()=>this.refs.openFile.click()}>
			<i className="fa fa-folder-open-o"></i>
			Open File...
		    </a> 
		</li>
		<li key="save" className={(atMyTrees ? "hidden":"")}>
		    <a onClick={(event)=>{
			    event.preventDefault();
			    this.props.saveTreeFile(this.props.tree)
			}}>
			<i className="fa fa-hdd-o"></i>
			Save File...
		    </a> 
		</li>			    
		<hr/>
		<li key="templates" className="disabled">
		    <a>
			Templates:
		    </a> 
		</li>			    
		{ this.renderTemplatesList() }
		</ul>
		{/* Magical invisible component that opens and parses files
		    purely on frontend */}
		<div  style={{display: "none"}}>
		    <FileReaderInput as="text" onChange={(e, results)=>{
			    this.props.loadTreeFile(e, results);
			    handleScroll(this.props.tree.cards.children[0].id,
					 this.props.tree.cards);
			}}>
			<li key="open">
			    <a  ref="openFile"></a>
			</li>		    
		    </FileReaderInput>			
		</div>
	    </span>		    
	);
    }
}


function mapStateToProps(state) {
    return {
	tree: state.tree.present,
	user: state.profiles.user
    };
}

export default connect(mapStateToProps, treesActions)(MenuTree);

