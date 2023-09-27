const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow; //Ventana aplicaci+on
const ipcMain = electron.ipcMain;
const { spawn } = require('child_process');

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
  // Ejecutar el script de Python al iniciar la aplicación
  const pythonScriptPath = 'tracker.py'; 
  const pythonProcess = spawn('python', [pythonScriptPath]);

  
  pythonProcess.stdout.on('data', (data) => {
    console.log(`Salida del script Python: ${data}`);
  });

  pythonProcess.stderr.on('data', (data) => {
      console.error(`Error en el script Python: ${data}`);
  });

  pythonProcess.on('close', (code) => {
      console.log(`Script Python finalizado con código de salida ${code}`);
      // Puedes realizar acciones adicionales después de que el script Python se cierre
  });

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
