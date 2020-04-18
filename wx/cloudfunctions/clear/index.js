// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init(
  {
    'env':'new-uh98w',
  }
)

// 云函数入口函数
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  try {
    await db.collection('scores')
    .where({
      _id:_.neq('')
    })
    .remove()
  } catch(e) {
    console.error(e)
  }

  try {
    await db.collection('users')
    .where({
      _id:_.neq('')
    })
    .remove()
  } catch(e) {
    console.error(e)
  }

}