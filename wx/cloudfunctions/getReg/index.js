// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init(
  {
    'env':'new-uh98w',
  }
)

// 云函数入口函数
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  var result = {}
  var openId = wxContext.OPENID
  const usr = await db.collection('users')
  .where({
    openId:openId
  })
  .get()

  console.log(usr)
  //{ data: [], errMsg: 'collection.get:ok' }
  if(usr.data.length == 0){//新用户

    result['code'] = 100
    return result
  }else{//老用户

    result['data'] = usr.data[0]
    result['code'] = 111
    return result
  }


}