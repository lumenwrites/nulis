import React, { Component } from 'react';
import { connect } from 'react-redux';

import { browserHistory } from 'react-router';
import { Link } from 'react-router';

/* Vendor Components */
import { Modal } from 'react-bootstrap';

/* Actions */
import * as cardsActions from '../actions/cards.actions';
import {setShowModal} from '../actions/preferences.actions';

class Stats extends Component {
    renderCalendar() {
	return(
	    <div className="calendar">
		<div className="counter">
		    {this.props.user.stats.streak}
		</div>
		<div className="progress-outer">
		    <div className="marks">
			{this.props.user.stats.calendar.map((day)=> {
			     var brightness = 0;
			     if (day.wordcount > 100){
				 brightness = (day.wordcount+100)/1000;
			     }
			     return <div key={day.date} className="mark"
					 style={{ background: `hsla(24, 98%, 49%, ${brightness})` }}
				    ></div>
			 })}
		    </div>
		</div>		    
	    </div>
	);
    }
    
    renderWordcounter() {
	var calendar = this.props.user.stats.calendar
	var wordcount = calendar[calendar.length - 1].wordcount;
	
	return(
	    <div className="wordcounter">
	    <div className="counter">
	    {wordcount}
	    </div>
		<div className="progress-outer">
		    <div className="progress-inner"
			 style={{"width" : `${wordcount/10}%`}}>
		    </div>
		    <div className="marks">
			{[...Array(10).keys()].map((i)=> {
			     return <div key={i} className="mark"></div>
			 })}
		    </div>
		</div>		    
	    </div>
	);
    }
    render() {
	if (!this.props.user ) { return null; }
	return(
	    <div className="statistics"
		 onClick={()=>this.props.setShowModal("stats")}>
		{this.renderCalendar()}
		{this.renderWordcounter()}
		<Modal className="free"
		       show={this.props.showModal =="stats" ? true : false}
		       onHide={()=>this.props.setShowModal(false)}>
		    <Modal.Header closeButton>
			<h1>Stats</h1>
		    </Modal.Header>
		    <div className="panel-modal">
			<p>This is your writing stats.</p>
			<p>The top bar is the calendar of the last 10 days,
			    brightness of the day depends on the amount of words you have
			    written(0 - completely white, 1000 - completely orange). </p>
			<p>Number to the left of it is your current streak - how many days in a row you have written at least 100 words.</p>
			<p> The bottom bar represents the number of words you wrote
			    today.</p>
		    </div>
		</Modal>
		
	    </div>
	);
    }
}


function mapStateToProps(state) {
    return {
    	user: state.profiles.user,
	showModal: state.preferences.showModal	
    };
}

export default connect(mapStateToProps, {setShowModal})(Stats);

