import { BrowserWindow } from '../services/electron';

export const popOauth = (host, options) => new Promise((resolve, reject) => {
  const authOptions = {
    client_id: '0eb7e6b90ed0502cdcfa',
    client_secret: '4efd8ac57116d8ee299157022ff21c7ebca11ae8',
    scope: ['user:email', 'notifications']
  };
  const githubUrl = 'https://github.com/login/oauth/authorize';
  const authUrl = `${githubUrl}?client_id=${authOptions.client_id}&scope=${authOptions.scope}`;

  const win = new BrowserWindow(options || {
    width: 1050,
    height: 650,
    show: true,
    'web-preferences': {
      'node-integration': false
    }
  });

  const handleCallback = url => {
    const rawCode = /code=([^&]*)/.exec(url) || null;
    const code = (rawCode && rawCode.length > 1) ? rawCode[1] : null;
    const error = /\?error=(.+)$/.exec(url);

    if (code || error) win.destroy();
    if (code) {
      resolve({
        client_id: authOptions.client_id,
        client_secret: authOptions.client_secret,
        code
      });
    } else if (error) {
      alert('Oops! Something went wrong and we couldn\'t' +
        'log you in using Github. Please try again.');
      reject(error);
    }
  };

  win.loadURL(authUrl);

  win.webContents.on('will-navigate', (event, url) => {
    handleCallback(url);
  });

  win.webContents.on('did-get-redirect-request', (event, oldUrl, newUrl) => {
    handleCallback(newUrl);
  });

  win.on('close', () => { win.destroy(); });
});
