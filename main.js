/**
 * Created by Acery on 2017/8/3.
 */
const electron = require('electron')
const ipcMain = electron.ipcMain
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let loadingParams = {
	width:580,
	height:200,
	frame: false,
	show: false,
	transparent:false
}

let mainParams = {
	width: 1000,
	height: 600,
	// icon: __dirname + '/icon.png',
	// titleBarStyle: 'hidden-inset',
	show: true,
	frame: false,
	transparent:false,
	// resizable: false,
};

let mainWindow;

function createWindow() {
	mainWindow = new BrowserWindow(mainParams);
	mainWindow.setMovable=false
	mainWindow.isResizable(false)
	mainWindow.isMovable=false
	
	// mainWindow.setTitle("test")
	// if (process.env.NODE_ENV === 'development') {
		console.log('develop');
		mainWindow.loadURL('http://localhost:2048/static/main');
		mainWindow.webContents.openDevTools();
	// } else {
	// 	mainWindow.loadURL(`file://${__dirname}/client/index.html`);
	// }
	
	
	// mainWindow.on('closed', () => {
	// 	mainWindow = null;
	// });
}

app.on('ready', () => {
	createWindow();
});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (mainWindow === null) {
		createWindow();
	}
});
