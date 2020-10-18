'use strict';

import constants from './constants.js';
import functions_dates from './functions_dates.js';


function Todays_timesheet() {
	this.todays_timesheet_html = ''; // component container
}


/************************************************************************************/
/* saving html component */
/************************************************************************************/
Todays_timesheet.prototype.display_todays = function() {

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


/************************************************************************************/
/* fill */
/************************************************************************************/
Todays_timesheet.prototype.fill_timesheet = function() {

	var timesheet = constants.get_cl_data().Simple_Timesheet;

	// separate todays and yesterdays htmls
	var wrap_today = document.getElementById( 'project_list_today' );
	var total_today = document.getElementById( 'seconds_total_today' );
	var wrap_yesterday = document.getElementById( 'project_list_yesterday' );
	var total_yesterday = document.getElementById( 'seconds_total_yesterday' );
	var html_today = '';
	var html_yesterday = '';
	var seconds_today = 0;
	var seconds_yesterday = 0;

	var i, len = timesheet.length;
	for ( i = 0; i < len; i++ ) {

		// fill component with data
		var html = this.todays_timesheet_html;
		html = html.replace( '{{project_name}}', this.get_project_name_by_id( timesheet[i].project ) );
		html = html.replace( '{{description}}', timesheet[i].description );
		html = html.replace( '{{activity_name}}', this.get_activity_name_by_id( timesheet[i].activity ) );
		html = html.replace( '{{duration}}', functions_dates.seconds_to_human_readable( timesheet[i].interval ) );
		if ( timesheet[i].task_name === null ) {
			html = html.replace( '{{task_name}}', '' );
		} else {
			html = html.replace( '{{task_name}}', timesheet[i].task_name );
		}

		if ( new Date( timesheet[i].date ).getDate() === new Date().getDate() ) {
			// today
			html_today += html;
			seconds_today += timesheet[i].interval;
		}
		else {
			// yesterday
			html_yesterday += html;
			seconds_yesterday += timesheet[i].interval;
		}

	}

	// write html into both
	wrap_today.innerHTML = html_today;
	total_today.innerHTML = functions_dates.seconds_to_human_readable( seconds_today );
	wrap_yesterday.innerHTML = html_yesterday;
	total_yesterday.innerHTML = functions_dates.seconds_to_human_readable( seconds_yesterday );

}


/************************************************************************************/
/* get project info by id */
/************************************************************************************/
Todays_timesheet.prototype.get_project_name_by_id = function( id ) {

	var projects = constants.get_cl_data().Simple_Projects;

	var i, len = projects.length;
	for ( i = 0; i < len; i++ ) {
		if ( projects[i].id === id ) {
			return projects[i].name;
		}
	}

	return 'null';

}

Todays_timesheet.prototype.get_activity_name_by_id = function( id ) {

	var activities = constants.get_cl_data().Simple_Activities;

	var i, len = activities.length;
	for ( i = 0; i < len; i++ ) {
		if ( activities[i].id === id ) {
			return activities[i].name;
		}
	}

	return 'null';

}


/************************************************************************************/
/* export class */
/************************************************************************************/
export default new Todays_timesheet;
