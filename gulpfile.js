// =============================================================================
// GULPFILE
// Front End Ninja — cyberpunk-portfolio
//
// Tasks:
//   gulp        — default: compile sass + watch
//   gulp sass   — single compile
//   gulp watch  — watch only
// =============================================================================

import gulp        from 'gulp';
import * as sass   from 'sass';
import gulpSass    from 'gulp-sass';
import sourcemaps  from 'gulp-sourcemaps';
import autoprefixer from 'gulp-autoprefixer';
import rename      from 'gulp-rename';

const sassCompiler = gulpSass(sass);

const paths = {
  scss: {
    src:   'scss/main.scss',
    watch: 'scss/**/*.scss',
    dest:  'dist/css',
  },
};

// ── Sass compile ──────────────────────────────────────────────────────────────

export function compileSass() {
  return gulp
    .src(paths.scss.src)
    .pipe(sourcemaps.init())
    .pipe(
      sassCompiler({
        outputStyle: 'compressed',
        silenceDeprecations: ['legacy-js-api'],
      }).on('error', sassCompiler.logError)
    )
    .pipe(autoprefixer())
    .pipe(rename({ basename: 'main', suffix: '.min' }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.scss.dest));
}

// ── Watch ─────────────────────────────────────────────────────────────────────

export function watchFiles() {
  gulp.watch(paths.scss.watch, compileSass);
}

// ── Exports ───────────────────────────────────────────────────────────────────

export const sassTask  = compileSass;
export const watchTask = watchFiles;
export default gulp.series(compileSass, watchFiles);
