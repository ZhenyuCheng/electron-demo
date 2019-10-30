//在主进程中创建程序菜单的简单API模版示例:
const {
    app,
    Menu,
    ipcMain,
    BrowserWindow
} = require('electron')
const {
    dialog
} = require('electron')
const { default: installExtension, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer');


const template = [{
    label: 'File',
    submenu: [{
        role: 'close'
    }]
},
// { role: 'editMenu' }
{
    label: 'Edit',
    submenu: [{
        role: 'undo'
    },
    // 可以通过角色来为menu添加预定义行为，最好给任何一个菜单指定 role去匹配一个标准角色, 而不是尝试在 click 函数中手动实现该行为。 内置的 role 行为将提供最佳的原生体验。
    {
        role: 'redo'
    },
    {
        type: 'separator'
    }, // 分割线
    ]
},
{
    role: 'help',
    submenu: [{
        label: 'Learn More',
        click: async () => { // 点击事件
            const {
                shell
            } = require('electron')
            await shell.openExternal('https://electronjs.org')
        }
    }]
}
]
installExtension(REACT_DEVELOPER_TOOLS)
.then((name) => console.log(`Added Extension:  ${name}`))
.catch((err) => console.log('An error occurred: ', err));
const menu = Menu.buildFromTemplate(template)
//监听应用准备完成的事件
app.on('ready', () => {
    //创建窗口
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });

    mainWindow.loadFile('index.html');

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    mainWindow.webContents.openDevTools();

    ipcMain.on('asynchronous-message', (event, arg) => {
        console.log(`async:${arg}`) // prints "ping"
        event.reply('asynchronous-reply', 'pong')
    })
    ipcMain.on('synchronous-message', (event, arg) => {
        console.log(`sync:${arg}`) // prints "ping"
        event.returnValue = 'pong'
    })


    Menu.setApplicationMenu(menu)

    console.log(dialog.showOpenDialog({
        properties: ['openFile', 'openDirectory', 'multiSelections']
    }))




    // 支持的扩展
    // EMBER_INSPECTOR, REACT_DEVELOPER_TOOLS,
    // BACKBONE_DEBUGGER, JQUERY_DEBUGGER,
    // ANGULARJS_BATARANG, VUEJS_DEVTOOLS,
    // REDUX_DEVTOOLS, REACT_PERF,
    // CYCLEJS_DEVTOOL, MOBX_DEVTOOLS,
    // APOLLO_DEVELOPER_TOOLS,
});

//监听所有窗口关闭的事件 
app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar // to stay active until the user quits explicitly with Cmd + Q 
    if (process.platform !== 'darwin') {
        app.quit();
    }
})