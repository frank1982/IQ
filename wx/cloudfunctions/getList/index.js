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

  console.log(event)
  //插入数据
  //先判断有没有重复
  const check =await db.collection('scores')
  .where({
    openId:wxContext.APPID,
    name:event.name,
  }).get()
  console.log(check)

  var myDate = new Date(Date.now() + (8 * 60 * 60 * 1000))
      var year = myDate.getFullYear();    //获取完整的年份(4位,1970-????)
      var month = myDate.getMonth() + 1;    //获取当前月份(0-11,0代表1月)
      if (month < 10) {
        month = "0" + month
      }
      var date = myDate.getDate();        //获取当前日(1-31)
      if (date < 10) {
        date = "0" + date
      }
      var dayStr = year + "" + month + "" + date
      var hours = myDate.getHours();
      if (hours < 10) {
        hours = "0" + hours
      }
      var minutes = myDate.getMinutes();
      if (minutes < 10) {
        minutes = "0" + minutes
      }
      var seconds = myDate.getSeconds();
      if (seconds < 10) {
        seconds = "0" + seconds
      }
      var detailTime = hours + ":" + minutes + ":" + seconds


  if(check.data.length > 0){//重名用户
    //哪个分数高?
    var oldScore=check.data[0].finalScore
    console.log("现有final scrore:"+oldScore)
    if(event.finalScore>=oldScore){
      //覆盖
      
      const update = await db.collection('scores')
      .where({
        openId:wxContext.APPID,
        name:event.name,
      })
      .update({
        data: {
          age:event.age,
          area:event.area,
          score:event.score,
          bonusScore_time:event.bonusScore_time,
          bonusScore_age:event.bonusScore_age,
          finalScore:event.finalScore,
          useTime:event.useTime,
          testTime:dayStr+' '+detailTime
        }
      })
    }
    
  }else{//不重名

    //新增
    const add = await db.collection('scores')
      .add({
        data: {

          openId:wxContext.OPENID,
          name:event.name,
          age:event.age,
          area:event.area,
          score:event.score,
          bonusScore_time:event.bonusScore_time,
          bonusScore_age:event.bonusScore_age,
          finalScore:event.finalScore,
          useTime:event.useTime,
          testTime:dayStr+' '+detailTime
        }
      })
  }

  //查询名次
  var finalScore = event.finalScore
  const totalNumCheck = await db.collection('scores').count()
  var totalNum = totalNumCheck.total//总记录数
  console.log("总记录数:"+totalNum)
  var check2 = await db.collection('scores')
  .where({
    finalScore:_.gt(finalScore) //大于
  })
  .count()
  var checkNum = check2.total//大于这个分数的记录数
  console.log("大于得分的记录数:"+checkNum)
  var result = {}
  result['list'] = checkNum+1 //排名第几
  result['winNum'] = Math.round((totalNum - checkNum - 1)*100/totalNum)//战胜了多少比例的人

  return result
}