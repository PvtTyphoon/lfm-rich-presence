const { app, BrowserWindow } = require("electron");

function initWindow() {
  let mainView = new BrowserWindow({
    height: 600,
    width: 800,
    icon: "build/icon.png",
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
    autoHideMenuBar: true,
  });
  mainView.loadFile("webpage/index.html");
  mainView.setResizable(false);
  mainView.on("closed", function () {
    mainView = null;
  });
}

app.on("ready", initWindow);
