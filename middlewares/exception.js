const { HttpException } = require('@core/http-exception')  //导出HttpExctption基类，把异常抛出写成一个类，来继承服务器的error类

const catchError = async (ctx, next) => {    //经过监听next（），若是下一个中间间出现错误就能够捕获到错误，能够知道在哪里可能出现错误，
  try {                                      //主动抛出一个错误，设置错误的errorCode类型，而后根据errorCode来判断错误类型
    await next()

  } catch (error) {
    // 开发环境
    const isHttpException = error instanceof HttpException;  //检测 constructor.prototype 是否存在于实例对象的原型链上
    const isDev = global.config.environment === 'dev';
      // console.log('error1', error)
    if (isDev && !isHttpException) {
      throw error
    }

    // 生产环境
    if (isHttpException) {
      ctx.body = {
        msg: error.msg,
        error_code: error.errorCode,
        request: `${ctx.method} ${ctx.path}`
      }
      ctx.response.status = error.code

    } else {
      ctx.body = {
        msg: "未知错误！",
        error_code: 9999,
        request: `${ctx.method} ${ctx.path}`
      }
      ctx.response.status = 500
    }
  }
}

module.exports = catchError
