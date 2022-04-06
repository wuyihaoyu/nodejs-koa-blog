const Sequelize = require('sequelize')
//Sequelize支持 Postgres, MySQL, MariaDB, SQLite 以及 Microsoft SQL Server. 具有强大的事务支持, 关联关系, 预读和延迟加载,读取复制
const {
  dbName,  //数据库名字
  host,    //本地地址
  port,    //端口号
  user,    //用户名字
  password //密码
} = require('../config/config').database   //导出数据库配置


const sequelize = new Sequelize(dbName, user, password, { //分别传递参数
  dialect: 'mysql', /* 选择 'mysql' | 'mariadb' | 'postgres' | 'mssql' 其一 */
  host,
  port,
  logging: false,
  timezone: '+08:00',
  define: {
    // create_time && update_time
    timestamps: true,                  //创建表的时间戳、修改表的时间戳。默认值为true
    // delete_time
    paranoid: true,                   //是软删除而非硬删除机制的表
    createdAt: 'created_at',          //创建表的时间
    updatedAt: 'updated_at',          //修改表的时间戳
    deletedAt: 'deleted_at',          //paranoid要求必须启用时间戳，即必须传timestamps: true
    underscored: true,                //把驼峰命名转换为下划线
    scopes: {                         //允许定义常用的查询
      bh: {
        attributes: {
          exclude: ['password', 'updated_at', 'deleted_at', 'created_at']
        }
      },
      iv: {
        attributes: {
          exclude: ['content', 'password', 'updated_at', 'deleted_at']
        }
      }
    }
  }
})

// 创建模型
sequelize.sync({ force: false })
//使用 .authenticate() 函数测试连接是否正常
sequelize.authenticate().then(res => {
  console.log('Connection has been established successfully.');
}).catch(err => {
  console.error('Unable to connect to the database:', err);
})

// sequelize.query("CREATE DATABASE IF NOT EXISTS boblog DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci").then(res=>{
//   console.log('CREATE DATABASE SUCCESS!')
// }).catch(err => {
//   console.log('CREATE DATABASE FAIL!', err)
// })


module.exports = {
  sequelize
}
