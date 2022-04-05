const Router = require('koa-router')
const requireDirectory = require('require-directory')

class InitManager {
  static initCore(app) {
    // 入口方法
    InitManager.app = app;                           //挂载实例在类上
    InitManager.initLoadRouters()
    InitManager.loadHttpException()
    InitManager.loadConfig()
  }

  // 加载全部路由
  static initLoadRouters() {
    // 绝对路径
    const apiDirectory = `${process.cwd()}/app/api` 
    //返回 Node.js 进程的当前工作目录,
    //process.cwd()方法可以获取项目的根路径,路由文件放在app/api下
    // 路由自动加载
    requireDirectory(module, apiDirectory, {        //require-directory 第一个参数固定为module，
      visit: whenLoadModule                         //第二个参数为要加载的路由的路径，第三个参数为注册路由的函数。
    })

    // 判断 requireDirectory 加载的模块是否为路由
    function whenLoadModule(obj) {
      // 如果是路由就进行注册
      if (obj instanceof Router) {
        InitManager.app.use(obj.routes())           //内部自动传入obj，内部自动处理
      }
    }
  }

  static loadConfig(path = '') {
    const configPath = path || process.cwd() + '/config/config.js'
    const config = require(configPath)
    global.config = config                         //将数据库配置挂载到全局上
  }

  static loadHttpException() {
    const errors = require('./http-exception')
    global.errs = errors                          //将报错的类型信息挂载到全局上
  }
}

module.exports = InitManager
