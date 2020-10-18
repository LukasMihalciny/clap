'use strict';

function Notifications() {}


/************************************************************************************/
/* corona notification, uses electron api */
/************************************************************************************/
Notifications.prototype.run_corona_notification = function( message ) {

	new Notification(
		'CLAP: New Corona cases in Slovakia',
		{
			body: message,
			icon: '../images/bat_1.ico',
		}
	);

}


/************************************************************************************/
/* export class */
/************************************************************************************/
export default new Notifications;
