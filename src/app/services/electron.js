const electron = __non_webpack_require__('electron');
const ipcRenderer = electron.ipcRenderer;
const shell = electron.shell;
const remote = electron.remote;

export const BrowserWindow = remote.BrowserWindow;

export const openUrl = shell.openExternal;

export function showWindow() {
  ipcRenderer.send('reopen-window');
}

export function quitApp() {
  ipcRenderer.send('app-quit');
}

export function updateTrayIcon(isActive) {
  ipcRenderer.send('update-icon', isActive ? 'TrayActive' : 'TrayIdle');
}

export function showNotification(title, body, icon, url) {
  const nativeNotification = new Notification(title, {
    body, icon
  });
  nativeNotification.onclick = (
    !url ? showWindow : () => { openUrl(url); }
  );
}

export function showVersion() {
  return require('../../../package.json').version;
}

export function checkUpdates() {
  ipcRenderer.send('check-updates');
}
