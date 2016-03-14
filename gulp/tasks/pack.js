import gulp from 'gulp';
import path from 'path';
import packager from 'electron-packager';
import config from '../../src/electron/package.json';

const packagerOptions = {
  dir: path.resolve(__dirname, '../../build/electron'),
  out: path.resolve(__dirname, '../../build'),
  name: config.productName,
  arch: 'all',
  version: config.electronVersion,
  'app-version': config.version
};

function pack(options, cb) {
  packager({ ...packagerOptions, ...options }, function (error, appPath) {
    if (error) throw error;
    else if (cb) cb();
  });
}

gulp.task('pack:electron', () => {
  pack({ platform: 'linux' }, () => {
    pack({
      platform: 'darwin',
      icon: path.resolve(__dirname, '../../src/electron/resources/osx/icon.icns')
    }, () => {
      pack({
        platform: 'win32',
        icon: path.resolve(__dirname, '../../src/electron/resources/windows/icon.ico')
      });
    });
  });
});
