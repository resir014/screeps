'use strict';

const gulp = require('gulp');
const gutil = require('gulp-util');
const tsproject = require('tsproject');
const clean = require('gulp-clean');
const runSequence = require('run-sequence');
const https = require('https');
const fs = require('fs');

const config = require('./config.json');

gulp.task('clean', () => {
  return gulp.src('dist', { read: false })
    .pipe(clean());
});

gulp.task('compile', ['clean'], () => {
  return tsproject.src('./tsconfig.json')
    .pipe(gulp.dest('dist'));
});

gulp.task('upload-sim', ['compile'], () => {
  let screeps = {
    email: config.email,
    password: config.password,
    data: {
      branch: config.branch,
      modules: {
        main: fs.readFileSync('./dist/main.js', { encoding: "utf8" })
      }
    }
  };

  let req = https.request({
    hostname: 'screeps.com',
    port: 443,
    path: '/api/user/code',
    method: 'POST',
    auth: screeps.email + ':' + screeps.password,
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    }
  }, (res) => {
    gutil.log('Build ' + gutil.colors.cyan('completed') + ' with HTTPS response ' + gutil.colors.magenta(res.statusCode));
  });

  req.write(JSON.stringify(screeps.data));
  req.end();
});

gulp.task('watch', () => {
  gulp.watch('./src/**/*.ts', ['compile']);
});

gulp.task('build', ['upload-sim']);

gulp.task('default', ['watch']);
