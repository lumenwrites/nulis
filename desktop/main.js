const electron = require('electron');
const {app, BrowserWindow} = electron;
const ipc = electron.ipcMain
require('electron-debug')({showDevTools: false});
/* require('electron-reload')(__dirname);*/

/* Electron modules */
const { Menu } = electron;
/* const countdown = require('./utils/index');*/

process.env.NODE_ENV = 'desktop';
/* Defining mainWindow here so I could use it in functions below */
let mainWindow

app.on('ready', _=>{
    /* Cerate main window */
    mainWindow = new BrowserWindow({
	height: 400,
	width: 400
    })

    /* Hide menu */
    Menu.setApplicationMenu(null)    
    
    /* Load index.html */
    mainWindow.loadURL(`file://${__dirname}/index.html`)

    /* Open dev tools */
    if (process.env.NODE_ENV === 'development') {
	mainWindow.webContents.openDevTools()
    }
    /* localShortcut.register('Ctrl+Shift+I', mainWindow.toggleDevTools());*/

    /* When window is closed - garbage collect and whatnot */
    mainWindow.on('closed',_=>{
	console.log('closed!')
	mainWindow = null
    })
});


/* html button sends the countdown start event */
ipc.on('countdown-start', _=> {
    /* countdown will pass the count variable to this function every second*/
    countdown(count => {
	/* once I get it - send the event to the frontend, giving it count */
	mainWindow.webContents.send('countdown',count)
    })
})
