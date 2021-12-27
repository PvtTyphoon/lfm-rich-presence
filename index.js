const { app, BrowserWindow, Menu, Tray  } = require("electron");
var tray = null;

function initWindow() {
  let mainView = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
    autoHideMenuBar: true,
  });
  mainView.loadFile("src/index.html");
  mainView.setResizable(false);

  mainView.on('minimize',function(event){
    event.preventDefault();
    mainView.hide();
});
  tray = new Tray("./assets/icon.png")
  const contextMenu = Menu.buildFromTemplate([
    {
        label: "Last.fm Rich Presence",
        enabled: false,
      },
      {
        type: "separator",
      },
      {
        label: "Open App",
        click: function () {
          mainView.show();
        },
      },
      {
        label: "Quit",
        click: function () {
          app.quit();
        },
      },
    ])
  tray.setToolTip('Last.fm Discord Rich Presence')
  tray.setContextMenu(contextMenu)
}

app.whenReady().then(() => {
    initWindow()
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) initWindow()
    })
  })
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })
