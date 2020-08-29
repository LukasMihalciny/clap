'use strict';

import constants from './constants.js';

function Todays_timesheet() {
	this.todays_timesheet_html = ''; // component container
}

Todays_timesheet.prototype.display_todays = function() {
	// saving component
	fetch(
		'../components/todays_timesheet_entry.html'
	).then(
		response => {
			return response.text();
		}
	).then(
		result => {
			this.todays_timesheet_html = result;
			this.fill_timesheet();
		}
	).catch( error => console.log( error ) );
}

Todays_timesheet.prototype.fill_timesheet = function() {
	var timesheet = constants.get_cl_data().Simple_Timesheet;
	var html = this.todays_timesheet_html;
	console.log( 'timesheet: ' + typeof timesheet ); console.log( timesheet );
	console.log( 'html: ' + typeof html ); console.log( html );
}

export default new Todays_timesheet;
