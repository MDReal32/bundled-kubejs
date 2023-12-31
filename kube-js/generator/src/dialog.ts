import { BrowserWindow, app, dialog } from "electron";

const name = process.argv[2];

app
  .whenReady()
  .then(() => {
    const browserWindow = new BrowserWindow({ x: 0, y: 0, show: false });
    return dialog.showSaveDialog(browserWindow, {
      filters: [{ extensions: ["zip"], name: "Zip" }],
      title: `Save ${name}`,
      message: "Save CurseForge project",
      buttonLabel: "Save CurseForge project",
      defaultPath: `${name}.zip`
    });
  })
  .then(({ filePath }) => {
    filePath && process.stdout.write(filePath);
    app.quit();
  });
