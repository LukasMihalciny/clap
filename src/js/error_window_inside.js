'use strict';

const ipc = require( 'electron' ).ipcRenderer;

// receive stringyfied data in 'message' hook
ipc.on(
	'message',
	function( event, data ) {

		var error_object = JSON.parse( data );
		var output = document.getElementById( 'error_output' );
		output.innerHTML = error_object.my_message + '<br><br>';

		for ( var key in error_object.error ) {
			if ( error_object.error.hasOwnProperty( key ) ) {
				output.innerHTML += key + ' : ' + JSON.stringify( error_object.error[key] ) + '<br>';
			}
		}

	}
);
