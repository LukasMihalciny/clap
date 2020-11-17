const { app, BrowserWindow, Menu, shell, Tray } = require('electron')
const path = require( 'path' )

// store window in variable to be able to restore it from system tray
let main_window;

function createWindow () {
	// Create the browser window.
	const win = new BrowserWindow({
		width: 1600,
		height: 900,
		webPreferences: {
			nodeIntegration: true
		},
		icon: path.join( __dirname, 'src/images/bat_1.ico' ),
		// transparent: true,
		// resizable: false,
		center: true,
		// thickFrame: true,
		webPreferences: {
			nodeIntegration: true,
			enableRemoteModule: true,
		},
	})

	// and load the main_window.html of the app.
	win.loadFile('src/pages/main_window.html')

	// Open the DevTools.
	// win.webContents.openDevTools()

	// set menu arguments
	const isMac = process.platform === 'darwin'
	const template = [
		// { role: 'appMenu' }
		...(isMac ? [{
			label: app.name,
			submenu: [
				{ role: 'about' },
				{ type: 'separator' },
				{ role: 'services' },
				{ type: 'separator' },
				{ role: 'hide' },
				{ role: 'hideothers' },
				{ role: 'unhide' },
				{ type: 'separator' },
				{ role: 'quit' }
			]
		}] : []),
		// { role: 'fileMenu' }
		{
			label: 'Clap',
			submenu: [
				// {
				// 	label: 'About',
				// 	click: async () => {
				// 		console.log( 'open about window' );
				// 		// await shell.openExternal('https://costlocker.docs.apiary.io/#reference/0/rest-api-v2')
				// 	}
				// },
				{
					label: 'About',
					click: async () => {
						await create_about_window();
					}
				},
				{
					label: 'Contact author',
					click: async () => {
						await shell.openExternal('mailto:mihalciny@studiotem.com?subject=Clap&body=')
					}
				},
				{ type: 'separator' },
				isMac ? { role: 'close' } : { role: 'quit' },
			]
		},
		// { role: 'editMenu' }
		{
			label: 'Edit',
			submenu: [
				{ role: 'undo' },
				{ role: 'redo' },
				{ type: 'separator' },
				{ role: 'cut' },
				{ role: 'copy' },
				{ role: 'paste' },
				...(isMac ? [
						{ role: 'pasteAndMatchStyle' },
						{ role: 'delete' },
						{ role: 'selectAll' },
						{ type: 'separator' },
					{
						label: 'Speech',
						submenu: [
							{ role: 'startspeaking' },
							{ role: 'stopspeaking' }
						]
					}
					] : [
						{ role: 'delete' },
						{ type: 'separator' },
						{ role: 'selectAll' }
				])
			]
		},
		/*{
			label: "Edit",
			submenu: [
				{ label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
				{ label: "Redo", accelerator: "CmdOrCtrl+Y", selector: "redo:" },
				{ type: "separator" },
				{ label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
				{ label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
				{ label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
				{ label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
			]
		},*/
		// { role: 'viewMenu' }
		{
			label: 'View',
			submenu: [
				{ role: 'reload' },
				{ role: 'forcereload' },
				{ role: 'toggledevtools' },
				{ type: 'separator' },
				{ role: 'resetzoom' },
				{ role: 'zoomin' },
				{ role: 'zoomout' },
				{ type: 'separator' },
				{ role: 'togglefullscreen' }
			]
		},
		// { role: 'windowMenu' }
		{
			label: 'Window',
			submenu: [
				{ role: 'minimize' },
				{ role: 'zoom' },
				...(isMac ? [
					{ type: 'separator' },
					{ role: 'front' },
					{ type: 'separator' },
					{ role: 'window' }
					] : [
					{ role: 'close' }
				])
			]
		},
		{
			role: 'help',
			submenu: [
				{
					label: 'CL webapp',
					click: async () => {
						await shell.openExternal('https://new.costlocker.com/timetracking')
					}
				},
				{
					label: 'CL api documentation',
					click: async () => {
						await shell.openExternal('https://costlocker.docs.apiary.io/#reference/0/rest-api-v2')
					}
				},
				{
					label: 'CL access token',
					click: async () => {
						await shell.openExternal('https://new.costlocker.com/api-token')
					}
				},
				{
					label: 'Corona api documentation',
					click: async () => {
						await shell.openExternal('https://documenter.getpostman.com/view/10808728/SzS8rjbc')
					}
				},
			]
		}
	];
	// create menu
	const menu = Menu.buildFromTemplate(template)
	Menu.setApplicationMenu(menu)

	// tray
	/*WAS BUGGED, TURNED OFF TEMPORARILY
	let tray = null;
	tray = createTray();
	win.on(
		'minimize',
		function( event ) {
			event.preventDefault();
			win.hide();
			// tray = createTray();
		}
	);
	win.on(
		'restore',
		function( event ) {
			win.show();
			// tray.destroy();
		}
	);*/

	// store in var
	return win;
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(
	() => {
		main_window = createWindow();
	}
)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
	// On macOS it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', () => {
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow()
	}
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

function createTray() {
	let appIcon = new Tray( path.join( __dirname, 'src/images/bat_1.ico' ) );
	const contextMenu = Menu.buildFromTemplate(
		[
			{
				label: 'Show window', click: function () {
					main_window.show();
				}
			},
			{
				label: 'Exit', click: function () {
					app.isQuiting = true;
					app.quit();
				}
			}
		]
	);
	appIcon.on(
		'double-click',
		function (event) {
			main_window.show();
		}
	);
	appIcon.setToolTip( 'Clap' );
	appIcon.setContextMenu( contextMenu );
	return appIcon;
}

// about window
function create_about_window() {
	// define new window
	var wind = new BrowserWindow(
		{
			width: 600,
			height: 450,
			frame: true,
			alwaysOnTop: true,
			webPreferences: {
				nodeIntegration: true
			},
			autoHideMenuBar: true,
			webPreferences: {
				nodeIntegration: true,
				enableRemoteModule: true,
			},
		}
	);
	// how to close window
	wind.on( 'close', function() { wind = null } );
	// set html file path and open window
	wind.loadFile('src/pages/about_window.html')
	wind.show();
}
