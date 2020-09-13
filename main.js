const { app, BrowserWindow, Menu, shell } = require('electron')

function createWindow () {
	// Create the browser window.
	const win = new BrowserWindow({
		width: 1600,
		height: 900,
		webPreferences: {
			nodeIntegration: true
		}
	})

	// and load the index.html of the app.
	win.loadFile('src/pages/index.html')

	// Open the DevTools.
	win.webContents.openDevTools()

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
		/*{
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
			]
		}
	];
	// create menu
	const menu = Menu.buildFromTemplate(template)
	Menu.setApplicationMenu(menu)

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow)

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
