'use strict';
const path = require( 'path' );
const electron = require('electron');
const BrowserWindow = electron.remote.BrowserWindow;
const Menu = electron.remote.Menu;

function Error_window() {}

Error_window.prototype.display = function( error_data, message ) {
	// define new window
	var wind = new BrowserWindow(
		{
			width: 600,
			height: 450,
			frame: true,
			alwaysOnTop: true,
			webPreferences: {
				nodeIntegration: true
			}
		}
	);

	// wind.webContents.openDevTools();

	var error_object = {
		my_message: message,
		error: error_data
	};

	// send error data as string
	wind.webContents.on(
		'did-finish-load',
		function() {
			wind.webContents.send(
				'message',
				JSON.stringify( error_object )
			);
		}
	);

	// disable menu
	var menu = Menu.buildFromTemplate( [] );
	Menu.setApplicationMenu( menu );

	// how to close window
	wind.on( 'close', function() { wind = null } );

	// set html file path and open window
	var file_path = path.join( 'file://', __dirname, 'error_window.html' );
	wind.loadURL( file_path );
	wind.show();
}

export default new Error_window;
