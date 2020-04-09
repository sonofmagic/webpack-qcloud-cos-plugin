const _ = require('lodash')
const assert = require('assert')
const WebpackQcloudCOSPlugin = require('../src/index')

const message = 'config 计算出错'

const config = {
  auth: {
    SecretId: '001',
    SecretKey: '002'
  },
  bucket: {
    Bucket: '003',
    Region: '004'
  },
  retry: 3,
  existCheck: true,
  cosBaseDir: 'auto_upload_ci',
  project: 'webpack-cos-plugin',
  version: '',
  exclude: /aa.*/,
  enableLog: false,
  ignoreError: true,
  removeMode: false,
  useVersion: false,
  gzip: true,
  options: 'a'
}

describe('参数初始化', function () {
  describe('#calc-config', function () {
    it('用户参数、默认参数合并: 用户设置所有选项 - 不使用环境变量', function () {
      clearEnv()
      var plugin = new WebpackQcloudCOSPlugin(config)
      // assert(_.isEqual(plugin.config, config), message);
      assert.deepStrictEqual(plugin.config, config, message)
    })
  })

  describe('#calc-config', function () {
    it('用户参数、环境变量、默认参数合并: bucket.Region 使用环境变量', function () {
      clearEnv()
      var cfg = _.cloneDeep(config)
      delete cfg.bucket.Region
      process.env.WEBPACK_QCCOS_PLUGIN_REGION = '004'
      var plugin = new WebpackQcloudCOSPlugin(cfg)
      cfg.bucket.Region = '004'
      assert.deepStrictEqual(plugin.config, cfg, message)
    })
  })

  describe('#calc-config', function () {
    it('环境变量、默认参数合并: bucket.Region 使用环境变量', function () {
      clearEnv()
      process.env.WEBPACK_QCCOS_PLUGIN_SECRET_ID = '001'
      process.env.WEBPACK_QCCOS_PLUGIN_SECRET_KEY = '002'
      process.env.WEBPACK_QCCOS_PLUGIN_BUCKET = '003'
      process.env.WEBPACK_QCCOS_PLUGIN_REGION = '004'
      process.env.WEBPACK_QCCOS_PLUGIN_ENABLE_LOG = false
      process.env.WEBPACK_QCCOS_PLUGIN_IGNORE_ERROR = true
      process.env.WEBPACK_QCCOS_PLUGIN_REMOVE_MODE = false
      process.env.WEBPACK_QCCOS_PLUGIN_USE_VERSION = false
      process.env.WEBPACK_QCCOS_PLUGIN_PREFIX = 'aa'
      process.env.WEBPACK_QCCOS_PLUGIN_EXCLUDE = /aa.*/
      var plugin = new WebpackQcloudCOSPlugin({
        options: 'a',
        exclude: /aa.*/,
        cosBaseDir: 'auto_upload_ci',
        project: ''
      })
      assert.deepStrictEqual(plugin.config, config, message)
      // assert(_.isEqual(plugin.config, config), message);
    })
  })

  describe('#npmProjectName', function () {
    it('提取 npm 包名', function () {
      clearEnv()
      process.env.WEBPACK_QCCOS_PLUGIN_SECRET_ID = '001'
      process.env.WEBPACK_QCCOS_PLUGIN_SECRET_KEY = '002'
      process.env.WEBPACK_QCCOS_PLUGIN_BUCKET = '003'
      process.env.WEBPACK_QCCOS_PLUGIN_REGION = '004'
      var plugin = new WebpackQcloudCOSPlugin({})
      assert.strictEqual(
        plugin.npmProjectName(),
        'webpack-cos-plugin',
        message
      )
    })
  })

  describe('#calc-config', function () {
    it('环境变量、默认参数合并: 初始化时不传参, eg: new WebpackQcloudCOSPlugin()', function () {
      clearEnv()
      process.env.WEBPACK_QCCOS_PLUGIN_SECRET_ID = '001'
      process.env.WEBPACK_QCCOS_PLUGIN_SECRET_KEY = '002'
      process.env.WEBPACK_QCCOS_PLUGIN_BUCKET = '003'
      process.env.WEBPACK_QCCOS_PLUGIN_REGION = '004'
      process.env.WEBPACK_QCCOS_PLUGIN_COS_BASE_DIR = 'default_dir'
      var plugin = new WebpackQcloudCOSPlugin()
      const cfg = {
        auth: {
          SecretId: '001',
          SecretKey: '002'
        },
        bucket: {
          Bucket: '003',
          Region: '004'
        },
        retry: 3,
        existCheck: true,
        cosBaseDir: 'default_dir',
        project: 'webpack-cos-plugin',
        version: '',
        exclude: /.*\.html$/,
        enableLog: false,
        ignoreError: false,
        removeMode: true,
        useVersion: false,
        gzip: true,
        options: undefined
      }
      assert.deepStrictEqual(plugin.config, cfg, message)
      assert.strictEqual(
        plugin.finalPrefix,
        'default_dir/webpack-cos-plugin',
        '-'
      )
    })
  })

  describe('#finalPrefix 计算', function () {
    it('环境变量、默认参数合并: 初始化时不传参, eg: new WebpackQcloudCOSPlugin()', function () {
      clearEnv()
      process.env.WEBPACK_QCCOS_PLUGIN_SECRET_ID = '001'
      process.env.WEBPACK_QCCOS_PLUGIN_SECRET_KEY = '002'
      process.env.WEBPACK_QCCOS_PLUGIN_BUCKET = '003'
      process.env.WEBPACK_QCCOS_PLUGIN_REGION = '004'
      process.env.WEBPACK_QCCOS_PLUGIN_COS_BASE_DIR = 'default_dir'
      var plugin = new WebpackQcloudCOSPlugin()
      assert.strictEqual(
        plugin.finalPrefix,
        'default_dir/webpack-cos-plugin',
        '-'
      )
    })
  })
})

function clearEnv() {
  delete process.env.WEBPACK_QCCOS_PLUGIN_SECRET_ID
  delete process.env.WEBPACK_QCCOS_PLUGIN_SECRET_KEY
  delete process.env.WEBPACK_QCCOS_PLUGIN_BUCKET
  delete process.env.WEBPACK_QCCOS_PLUGIN_REGION
  delete process.env.WEBPACK_QCCOS_PLUGIN_ENABLE_LOG
  delete process.env.WEBPACK_QCCOS_PLUGIN_IGNORE_ERROR
  delete process.env.WEBPACK_QCCOS_PLUGIN_REMOVE_MODE
  delete process.env.WEBPACK_QCCOS_PLUGIN_PREFIX
  delete process.env.WEBPACK_QCCOS_PLUGIN_EXCLUDE
  delete process.env.WEBPACK_QCCOS_PLUGIN_COS_BASE_DIR
}