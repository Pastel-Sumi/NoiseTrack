const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow; //Ventana aplicaci+on
const ipcMain = electron.ipcMain;

const path = require("path");
const isDev = require("electron-is-dev");

//Conexión mongoDB
require("../src/config/mongodb");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1500,
    height: 1000,
    title: "NoiseTrack",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
    // titleBarStyle: "hiddenInset",
    // resizable: false,
  });
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );

  if (isDev) mainWindow.webContents.openDevTools();

  mainWindow.on("closed", () => (mainWindow = null));
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('test', (e,args) => {
  console.log(args)
})
