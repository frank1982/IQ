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
  console.log(event)
  /*
  age: '5周岁',
  area: '河北',
  name: '网网',
  */
  
  const usr = await db.collection('users')
  .where({
    openId:openId
  })
  .get()

  console.log(usr)
  //{ data: [], errMsg: 'collection.get:ok' }
  if(usr.data.length == 0){//新用户

    const add = await db.collection('users').add({
      data:{
        openId:openId,
        name:event.name,
        age:event.age,
        area:event.area,
      }
    })
    console.log(add)
    //{ _id: '90bc5ee75e114ffc00a1b8b16c5917d0',errMsg: 'collection.add:ok' }
    if(add.errMsg == 'collection.add:ok'){
      result['code'] = 222//新增成功
      return result
    }
  
  }else{//老用户

    const update = await db.collection('users').update({
      data:{
        openId:openId,
        name:event.name,
        age:event.age,
        area:event.area,
      }
    })
    console.log(update)
    //{ _id: '90bc5ee75e114ffc00a1b8b16c5917d0',errMsg: 'collection.add:ok' }
    if(update.errMsg == 'collection.update:ok'){
      result['code'] = 333//新增成功
      return result
    }
   
  }


}