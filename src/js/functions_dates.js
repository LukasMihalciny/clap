'use strict';

function Functions_dates() {}

Functions_dates.prototype.convert_date_to_utc = function ( date ) {
	return new Date(
		date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()
	);
}

Functions_dates.prototype.convert_date_to_readable_format = function( date ) {
	return ( '0' + date.getHours() ).slice(-2) +
	':' +
	( '0' + date.getMinutes() ).slice(-2) +
	':' +
	( '0' + date.getSeconds() ).slice(-2);
}

Functions_dates.prototype.current_datetime_in_request_format = function() {
	// '2020-08-23T10:30:26+0000'
	var now = new Date();
	return now.getFullYear() +
	'-' +
	( '0' + (now.getMonth()+1) ).slice(-2) +
	'-' +
	( '0' + now.getDate() ).slice(-2) +
	'T' +
	( '0' + now.getHours() ).slice(-2) +
	':' +
	( '0' + now.getMinutes() ).slice(-2) +
	':' +
	( '0' + now.getSeconds() ).slice(-2) +
	'+0000';
}

Functions_dates.prototype.current_date_in_request_format = function() {
	// '2020-08-24'
	var now = new Date();
	return now.getFullYear() +
	'-' +
	( '0' + (now.getMonth()+1) ).slice(-2) +
	'-' +
	( '0' + now.getDate() ).slice(-2);
}

Functions_dates.prototype.get_duration_in_seconds = function( cl_start ) {
	var start = new Date( cl_start );
	start = this.convert_date_to_utc( start );
	var now = new Date();
	var diff_in_seconds = ( now - start ) / 1000;
	diff_in_seconds = Math.round( diff_in_seconds );
	return diff_in_seconds;
}

Functions_dates.prototype.seconds_to_human_readable = function( seconds ) {
	// '00:21:49'
	var hours = Math.floor( seconds / 3600 );
	var minutes = Math.floor( seconds % 3600 / 60 );
	var seconds = Math.floor( seconds % 3600 % 60 );
	return ( '0' + hours ).slice(-2) +
	':' +
	( '0' + minutes ).slice(-2) +
	':' +
	( '0' + seconds ).slice(-2);
}

export default new Functions_dates;
