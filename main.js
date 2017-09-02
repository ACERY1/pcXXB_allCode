/**
 * Created by Acery on 2017/8/3.
 */
const electron = require('electron')
const ipcMain = electron.ipcMain // Subscribe the render process
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let loadingParams = {
	width: 580,
	height: 200,
	frame: false,
	show: false,
	transparent: false,
	
}

let mainParams = {
	width: 1000,
	height: 600,
	show: true,
	frame: false,
	icon: './client/static/logos/main.png',
	transparent: false, // make the top-toolBar transparent
	// resizable: false, // control the resize of the window
};

let mainWindow; //主窗口作用域
let isFull = false; //判断是否全屏
let isOnClass = false; //判断是否上课用于触发resize的重绘

function createWindow() {
	mainWindow = new BrowserWindow(mainParams);
	// mainWindow.setTitle("test")
	// if (process.env.NODE_ENV === 'development') {
	mainWindow.loadURL('http://localhost:2048/static');
	// mainWindow.webContents.openDevTools();
	
	// } else {
	// 	mainWindow.loadURL(`file://${__dirname}/client/index.html`);
	// }
	
	mainWindow.on('closed', () => {
		mainWindow = null;
	});
}


app.on('ready', () => {
	createWindow();
	
	// 监听最小化事件
	ipcMain.on('minimize', () => {
		mainWindow.minimize()
	})
	// 监听最大化事件
	ipcMain.on('maximize', (event) => {
		if (isFull) {
			mainWindow.setFullScreen(false)
			isFull = false
		} else {
			mainWindow.setFullScreen(true)
			isFull = true
		}
		
		// 如果在上课，触发重绘命令
		if (isOnClass) {
			event.sender.send('redraw')
		}
	})
	// 监听退出事件
	ipcMain.on('quitApp', () => {
		app.quit()
	})
	// 监听esc键
	ipcMain.on('esc', (event) => {
		mainWindow.setFullScreen(false)
		// 如果在上课，触发重绘命令
		if (isOnClass) {
			event.sender.send('redraw')
		}
	})
	// 全屏
	ipcMain.on('fullScreen', () => {
		mainWindow.setFullScreen(true)
	})
	// 缩小屏幕
	ipcMain.on('shrinkScreen', () => {
		if (!isFull) {
			mainWindow.setFullScreen(false)
		}
	})
	
	// 制作课件
	ipcMain.on("courseWare", () => {
		mainWindow.loadURL("http://localhost:2048/courseware.html")
	})
	
	// 制作报告
	ipcMain.on("report", () => {
		mainWindow.loadURL("http://localhost:2048/report.html")
	})
	
	// 上课状态
	ipcMain.on('onClass', (e, arg) => {
		isOnClass = arg
	})
	
	
	//
	// mainWindow.on('enter-full-screen', () => {
	// 	// console.log(mainWindow.getSize()())
	// 	mainWindow.isResizable(true)
	// })
	//
	// mainWindow.on('leave-full-screen', () => {
	// 	// console.log(mainWindow.getSize()())
	// 	mainWindow.isResizable(false)
	// })
	
	
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


