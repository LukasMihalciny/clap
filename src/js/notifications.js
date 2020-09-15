'use strict';

function Notifications() {}

Notifications.prototype.run_corona_notification = function( message ) {
	new Notification(
		'CLAP: New Corona cases in Slovakia',
		{
			body: message,
			icon: '../images/cat_2.ico',
		}
	);
}

export default new Notifications;
