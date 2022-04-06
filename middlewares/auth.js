const basicAuth = require('basic-auth')       //验证方案，Auth.js权限验证中间件
const jwt = require('jsonwebtoken')           //导入jwt验证模块，用户和服务器之间传递安全可靠的信息

class Auth {
  constructor(level) {
    this.level = level || 1;

    Auth.USER = 8;
    Auth.ADMIN = 16;
    Auth.SPUSER_ADMIN = 32;
  }

  get m() {
    // token 检测
    // token 开发者 传递令牌
    // token body header
    // HTTP 规定 身份验证机制 HttpBasicAuth
    return async (ctx, next) => {
      const tokenToken = basicAuth(ctx.req);//basicAuth(req)将从req.headers.authorization中解析出用户输入的用户名和密码和token

      let errMsg = "无效的token";
      // 无带token
      if (!tokenToken || !tokenToken.name) {
        errMsg = "需要携带token值";
        throw new global.errs.Forbidden(errMsg);
      }

      try {                  //token秘钥验证,jwt.verify(验证的token,加密的密文,回调)
        var decode = jwt.verify(tokenToken.name, global.config.security.secretKey);

      } catch (error) {
        // token 不合法 过期
        if (error.name === 'TokenExpiredError') {
          errMsg = "token已过期"
        }

        throw new global.errs.Forbidden(errMsg);
      }

      if (decode.scope < this.level) {
        errMsg = "权限不足"
        throw new global.errs.Forbidden(errMsg);
      }

      ctx.auth = {              //ctx上下文携带uid，scope
        uid: decode.uid,
        scope: decode.scope
      }

      await next()             //进入下一个中间件
    }
  }

}

module.exports = {
  Auth
}
