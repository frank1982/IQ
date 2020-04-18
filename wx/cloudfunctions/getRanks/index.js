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

  const ranks =await db.collection('scores')
  .orderBy('finalScore', 'desc')
  .limit(5)
  .get()
  console.log(ranks)

  return ranks.data
}