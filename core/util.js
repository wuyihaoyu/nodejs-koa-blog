const jwt = require('jsonwebtoken')                  //导入令牌token模块
/***
 *
 */
const findMembers = function (instance, {            //表达式函数，第一个参数为instance,第二个参数为一个对象{ prefix,specifiedType,filter}
  prefix,
  specifiedType,
  filter
}) {
  // 递归函数
  function _find(instance) {
    //基线条件（跳出递归）
    if (instance.__proto__ === null)                 //读取或设置当前对象的原型,判断instance原型是否为空，是则返回空数组
      return []

    let names = Reflect.ownKeys(instance)            //返回一个由instance目标对象自身的属性键组成的数组
    names = names.filter((name) => {                 //filter创建一个新的数组，新数组中的元素是通过检查指定数组中符合条件的所有元素
      // 过滤掉不满足条件的属性或方法名
      return _shouldKeep(name)
    })

    return [...names, ..._find(instance.__proto__)]  //展开运算符，返回数组，数组中递归调用_find函数
  }

  function _shouldKeep(value) {                      //函数_shouldKeep，
    if (filter) {                                    //传进来的参数filter
      if (filter(value)) {
        return true                                  //filter函数传入name参数，存在则返回真
      }
    }
    if (prefix)
      if (value.startsWith(prefix))                 //传进来的参数prefix,检测name字符串是否以指定的prefix前缀开始,存在则返回真
        return true
    if (specifiedType)
      if (instance[value] instanceof specifiedType) //传进来的参数specifiedType，原型链判断
        return true                                 //instance[value]是数组instance[name]，找到对应值  instanceof判断是否属于specifiedType原型
  }

  return _find(instance)                            //返回_find函数调用的结果
}

// 颁布令牌
const generateToken = function (uid, scope) {        //文档通用配置
  const secretKey = global.config.security.secretKey;//配置项中的密钥和过期时间
  const expiresIn = global.config.security.expiresIn; 
  const token = jwt.sign({        //接收三个参数，第一个是载荷，用于编码后存储在 token 中的数据，也是验证 token 后可以拿到的数据；                  
    uid,                          //第二个是密钥，自己定义的，验证的时候也是要相同的密钥才能解码；
    scope                         //第三个是options，可以设置 token 的过期时间。
  }, secretKey, {
    expiresIn: expiresIn
  })
  return token                    //generateToken函数返回token
}

module.exports = {                //导出findMembers函数，generateToken颁布令牌函数。
  findMembers,
  generateToken,
}
