import gulp from 'gulp';
import requireDir from 'require-dir';
requireDir('./gulp/tasks');

gulp.task('default', ['webpack-dev-server', 'views:dev', 'copy:dev']);
gulp.task('build:electron',
  ['webpack:build:electron', 'views:build:electron', 'copy:build:electron']);
