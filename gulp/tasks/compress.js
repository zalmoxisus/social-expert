import gulp from 'gulp';
import path from 'path';
import del from 'del';
import zip from 'gulp-zip';
import electronBuilder from 'electron-builder';
import config from '../../src/electron/package.json';

const compress = (src, name, dest = './build') => () => {
  gulp.src(src + '/**/*')
    .pipe(zip(name))
    .pipe(gulp.dest(dest));
};

gulp.task('dmg:electron:osx', () => {
  del([`./build/${config.productName}.dmg`]).then(paths => {
    console.warn('paths', paths);
    const builder = electronBuilder.init();
    builder.build({
      appPath: path.resolve(`./build/${config.productName}-darwin-x64/${config.productName}.app`),
      platform: 'osx',
      out: path.resolve('./build'),
      config: './src/electron/resources/config.json'
    }, function (err) {
      if (err) console.error(err);
    });
  });
});

gulp.task('compress:electron:osx',
  compress(
    `./build/${config.productName}-darwin-x64/${config.productName}.app`,
    `${config.name}.zip`
  )
);

gulp.task('compress:electron',
  [
    'dmg:electron:osx',
    'compress:electron:osx'
  ]
);
