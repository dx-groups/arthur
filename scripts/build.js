const vfs = require('vinyl-fs')
const babel = require('@babel/core')
const through = require('through2')
const chalk = require('chalk')
const rimraf = require('rimraf')
const {
  readFileSync, writeFileSync, existsSync
} = require('fs')
const { join } = require('path')
const chokidar = require('chokidar')

const lib = 'lib'

const browserBabelConfig = {
  presets: [
    [
      require.resolve('@babel/preset-env'),
      {
        browsers: ['last 2 versions', 'IE 10'],
        modules: 'commonjs',
      },
    ],
    require.resolve('@babel/preset-react'),
    [require.resolve('@babel/preset-stage-0'), { decoratorsLegacy: true }],
  ],
  plugins: [require.resolve('@babel/plugin-transform-runtime')],
}

const cwd = process.cwd()

function transform(opts = {}) {
  const { content, path } = opts
  console.log(chalk.yellow(`[TRANSFORM] ${path.replace(`${cwd}/`, '')}`))
  const config = browserBabelConfig
  return babel.transform(content, config).code
}

function buildPkg() {
  rimraf.sync(join(cwd, lib))
  vfs
    .src(`./src/**/*.js`)
    .pipe(through.obj((f, enc, cb) => {
        f.contents = new Buffer( // eslint-disable-line
        transform({
          content: f.contents,
          path: f.path,
        }))
      cb(null, f)
    }))
    .pipe(vfs.dest(`./${lib}/`))
}

function build() {
  const arg = process.argv[2]
  const isWatch = arg === '-w' || arg === '--watch'
  buildPkg()
  if (isWatch) {
    const watcher = chokidar.watch(join(cwd, 'src'), {
      ignoreInitial: true,
    })
    watcher.on('all', (event, fullPath) => {
      if (!existsSync(fullPath)) return
      const relPath = fullPath.replace(`${cwd}/src/`, '')
      const content = readFileSync(fullPath, 'utf-8')
      try {
        const code = transform({
          content,
          path: fullPath,
        })
        writeFileSync(
          join(cwd, lib, relPath),
          code,
          'utf-8'
        )
      } catch (e) {
        console.log(chalk.red('Compiled failed.'))
        console.log(chalk.red(e.message))
      }
    })
  }
}

build()
