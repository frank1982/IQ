// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init(
  {
    'env':'new-uh98w',
  }
)

// 云函数入口函数
const db = cloud.database()
const MAX_LIMIT = 100
exports.main = async (event, context) => {
  // 先取出集合记录总数
  /*
  const countResult = await db.collection('questions').count()
  const total = countResult.total
  // 计算需分几次取
  const batchTimes = Math.ceil(total / 100)
  // 承载所有读操作的 promise 的数组
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = db.collection('questions').skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }
  // 等待所有
  return (await Promise.all(tasks)).reduce((acc, cur) => {
    return {
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
    }
  })
  */
  
  /*
    const type1Subs = await db.collection('subject').aggregate()
      .match({exam_id:exam_id,type:1})
      .sample({
        size: 40
      })
      .limit(40)
    })
    console.log(type1Subs.list.length) //云函数后台打印日志值为 40，符合预期。
  */

  const q1 = await db.collection('questions').aggregate()
  .match({level:1})
  .sample({
    size: 5
  })
  .limit(5)
  .end()
  console.log(q1.list)  

  const q2 = await db.collection('questions').aggregate()
  .match({level:2})
  .sample({
    size: 5
  })
  .limit(5)
  .end()
  console.log(q2.list) 

  const q3 = await db.collection('questions').aggregate()
  .match({level:3})
  .sample({
    size: 5
  })
  .limit(5)
  .end()
  console.log(q3.list) 

  var result = []
  result = (q1.list.concat(q2.list)).concat(q3.list)
  return result

}