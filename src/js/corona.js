'use strict';

import api_requests from './api_requests.js';
import error_window from './error_window.js';
import notifications from './notifications.js';

function Corona() {
	this.result = {};
}

Corona.prototype.set_result = function( string ) {
	this.result = JSON.parse( string );
}
Corona.prototype.get_result = function() {
	return this.result.Countries;
}

Corona.prototype.initialize_corona = function() {
	var delay = Math.round( ( Math.random() * 100 ) + 20 ) * 1000;
	setTimeout(
		function(){ this.run_corona() }.bind( this ),
		delay
	);
}

Corona.prototype.run_corona = function() {
	api_requests.corona_cases_api_promise().then(
		result => {
			if ( api_requests.get_response_status_code() === 200 ) {
				// success
				this.set_result( result );
				this.display_cases();
			} else {
				// display error
				error_window.display( result, 'Corona API request failed.' );
			}
		}
	);
}

Corona.prototype.display_cases = function() {
	var countries = this.get_result();
	var svk = {};
	for ( var country in countries ) {
		if ( ! countries.hasOwnProperty( country ) ) {
			continue;
		}
		if ( countries[country].CountryCode === 'SK' ) {
			svk = countries[country];
		}
	}
	// var format = 'Corona stats for ' + svk.Country + ' - ';
	// format += 'NEW confirmed/recovered/deaths: ' + [ svk.NewConfirmed, svk.NewRecovered, svk.NewDeaths ].join( '/' );
	// format += 'TOTAL confirmed/recovered/deaths: ' + [ svk.TotalConfirmed, svk.TotalRecovered, svk.TotalDeaths ].join( '/' );
	notifications.run_corona_notification( svk.NewConfirmed );
}

export default new Corona;
