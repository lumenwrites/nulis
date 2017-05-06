import React, { Component } from 'react';
import { connect } from 'react-redux';

import { browserHistory } from 'react-router';
import { Link } from 'react-router';

/* Actions */
import {setCardColor} from '../actions/index';


class ColorBox extends Component {
    renderColors() {
	var colors = ["#0079BF", "#EB5A46","#FFAB4A","#61BD4F","#C377E0", ""];
	return colors.reverse().map((c)=>{
	    return (
		<div key={c}
		     className="color-box"
		     onClick={()=>this.props.setCardColor(c)}
		     style={{background: c}}
		></div>
	    )
	})
    }
    render () {
	const { authenticated } = this.props;

	return (
	    <div className={"colors " + (this.props.show ? "" : "hidden")}>
		{this.renderColors()}
	    </div>
	);
    }
}


export default connect(null, {setCardColor})(ColorBox);

