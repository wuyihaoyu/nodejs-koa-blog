const Koa = require('koa')                 //导入koa模块
const InitManager = require('./core/init') //
const parser = require('koa-bodyparser')   //导入koa-bodyparser模块，主要针对请求报文的处理
const cors = require('@koa/cors');         //导入跨域模块
const ratelimit = require('koa-ratelimit');//导入KOA2速率限制中间件,用于限制对API和/或端点的重复请求

require('module-alias/register')           //使用module-alias,这里@root就是别名，后面引号内的内容就是原路径


const catchError = require('./middlewares/exception')  //导入捕抓错误的函数

const app = new Koa()                      //实例化Koa

app.use(cors())                            //使用中间件，app.use()只能用于注册中间件并且必须是生成器函数，
app.use(catchError)                        //app.use是用来注册koa2中间件
app.use(parser())

// 接口调用频率限制（Rate-Limiting）
// Rate limiter middleware for koa.
// https://github.com/koajs/ratelimit
const db = new Map();                     //实例化Map字典，是以[键，值]的形式存储
app.use(ratelimit({                       //注册限制速率的中间件，配置应用速率限制
  driver: 'memory',                       //使用内存驱动
  db: db,                                 //redis连接实例或Map实例（内存）
  duration: 60000,                        //以毫秒为单位的限制
  errorMessage: 'Sometimes You Just Have to Slow Down.',//自定义错误信息
  id: (ctx) => ctx.ip,                    //用于比较请求的 id [ip]
  headers: {                              //自定义请求头
    remaining: 'Rate-Limit-Remaining',
    reset: 'Rate-Limit-Reset',
    total: 'Rate-Limit-Total'
  },
  max: 100,                               //duration[2500]内的最大请求数
  disableHeader: false,                   //设置是否发送remaining, reset, totalheaders
  whitelist: (ctx) => {                   //如果函数返回 true，则中间件在限制前退出
    // some logic that returns a boolean
  },
  blacklist: (ctx) => {                   //如果函数返回 true，403则抛出错误
    // some logic that returns a boolean
  }
}));

InitManager.initCore(app)                 //调用InitManager的静态方法，静态方法不用实例化

app.listen(5000, () => {                  //启动服务器端口5000，并监听
  console.log('Koa is listening in http://localhost:5000')
})

module.exports = app                      //导出koa实例
