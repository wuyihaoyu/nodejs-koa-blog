const moment = require('moment');        //日期处理类库
const bcrypt = require('bcryptjs')       //第三方加密库
const { sequelize } = require('@core/db')
const { Model, DataTypes } = require('sequelize')

// 定义管理员模型
class Admin extends Model {

}

// 初始管理员模型
Admin.init({
  id: {
    type: DataTypes.INTEGER(10).UNSIGNED,  //数据类型，整型，无符号，
    primaryKey: true,                      //主键
    autoIncrement: true,                   //自增
    comment: '管理员主键ID'                 //注释
  },
  email: {
    type: DataTypes.STRING(50),             //字符串
    unique: 'admin_email_unique',           //唯一性
    allowNull: false,                       //允许为空        
    comment: '登录邮箱'                      //注释
  },
  password: {
    type: DataTypes.STRING,
    set(val) {                               //set,get函数创建模型时自动触发
      // 加密,同步用法
      const salt = bcrypt.genSaltSync(10);
      // 生成加密密码
      const psw = bcrypt.hashSync(val, salt);//salt+password-->加密密码
      this.setDataValue("password", psw);    //设置存入密码
    },
    allowNull: false,
    comment: '登录密码'
  },
  nickname: {
    type: DataTypes.STRING(50),
    // 将 allowNull 设置为 false 将为该列添加 NOT NULL,
    // 这意味着如果该列为 null,则在执行查询时将从数据库引发错误.
    allowNull: false,
    // 备注
    comment: '管理员昵称'
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    comment: '创建时间',
    get() {
      return moment(this.getDataValue('created_at')).format('YYYY-MM-DD HH:mm:ss');
    }
  }
}, {
  sequelize,
  modelName: 'admin',      //模型名称
  tableName: 'admin'       //表名称
})


module.exports = {
  Admin
}
