// miniprogram/pages/index/test.js
const app = getApp()
const back = wx.createInnerAudioContext();
var  flag_isCanTest = true
Page({

  /**
   * 页面的初始数据
   */
  data: {

    flag_startInter:true,
    questions:[],
    showQuestion:{},
    //存储计时器
    setInter:'',
    setInter_num:4,
    setInterStr:'',

    setInter_test:'',
    nowQnum:0,
    //totalQnum:0,
    unitTestTime:30,
    nowTestLeftTime:30,

    setInter_clock:'',
    isCorrect:[0,0,0,0],
    backmusic:function(){
      back.title = "开启继续阅读";
      back.src = "/pages/video/openblock.mp3";
      back.play();
      back.onPlay(() => {
          console.log("音乐播放开始");
      });
      back.onEnded(() => {
          console.log("音乐播放结束");
      })
    
    },

    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //下载题目和答案
    wx.cloud.callFunction({
      // 需调用的云函数名
      name: 'getQuestions',
      // 成功回调
      complete: res => {

        console.log(res)
        var ques = []
        var tmp = {}
        var changshiNum = 0
        var suanshuNum = 0
        var luojiNum = 0
        for(var i=0;i<res.result.length;i++){

          tmp=res.result[i]
          ques.push(tmp)
          if(tmp.type == '常识题'){
            changshiNum += 1
          }else if(tmp.type == '算术题'){
            suanshuNum += 1
          }else if(tmp.type == '逻辑题'){
            luojiNum += 1
          }

        }
        this.setData({
          questions:ques,
          totalQnum:res.result.length
        })
        app.globalData.changshiNum = changshiNum
        app.globalData.suanshuNum = suanshuNum
        app.globalData.luojiNum = luojiNum
        app.globalData.totoalNum=res.result.length
        app.globalData.unitTestTime = this.data.unitTestTime
        console.log("常识题共有:"+app.globalData.changshiNum)
        console.log("算术题共有:"+app.globalData.suanshuNum)
        console.log("逻辑题共有:"+app.globalData.luojiNum)
        console.log("题目共有:"+app.globalData.totoalNum)
      }
    })
    var that = this
    this.data.setInter = setInterval(
      function () {
        
        if(that.data.setInter_num >= 2){
          
          that.setData({ 
            setInter_num: that.data.setInter_num -= 1, 
            setInterStr:that.data.setInter_num,
          });
        }else if(that.data.setInter_num == 1){// =1
          that.setData({ 
            setInter_num: that.data.setInter_num - 1, 
            setInterStr:'开始',
          });

        }else{// = 0
          //clearInter
          clearInterval(that.data.setInter)
          that.setData({
            flag_startInter:false,
            setInter:'',
          })


          //开始答题
          var num = that.data.nowQnum
          that.setData({ 
            showQuestion:that.data.questions[that.data.nowQnum],
          });
          back.stop()
          back.src = "pages/video/start.mp3";
          back.play();
          //记录开始时间
          //var startTime= new Date()
          var startTime = Date.parse(new Date()); 
          //注意：这种方法在js中，月份是以0开始的，所有要加1
          console.log("startTime:"+startTime)
          app.globalData.startTime = startTime

          var she = that
          that.data.setInter_clock = setInterval(
            function(){
              she.setData({
                
                nowTestLeftTime:she.data.nowTestLeftTime - 1,
              })
            },1000)

          var it = that
          that.data.setInter_test = setInterval(
            function () {

              it.setData({ 
                nowQnum:it.data.nowQnum + 1
              })
              console.log(it.data.setInter_test_num)
              if(it.data.nowQnum < it.data.totalQnum-1){

                //back.title = "开启继续阅读";
                back.stop()
                back.src = "pages/video/start.mp3";
                back.play();

                console.log("num:"+num)
                it.setData({ 
                  showQuestion:it.data.questions[it.data.nowQnum],
                  //setInter_test_num: num + 1, 
                  //setInterStr:'开始',
                });

                //闹钟时间
                clearInterval(it.data.setInter_clock)
                it.setData({
                  setInter_clock:'',
                  nowTestLeftTime:it.data.unitTestTime,
                })
                var he = it
                it.data.setInter_clock = setInterval(
                  function(){
                    he.setData({
                      nowTestLeftTime:he.data.nowTestLeftTime - 1,
                    })
                  },1000
                )

              }else{//结束
                //clearInter
                
                clearInterval(it.data.setInter_test)
                clearInterval(it.data.setInter_clock)
                it.setData({
                  setInter_clock:'',
                })
                console.log("测试结束")
                //记录结束时间
                //测试结束
                var endTime = Date.parse(new Date()); 
                console.log("endTime:"+endTime)
                app.globalData.endTime = endTime
                back.stop()
                wx.redirectTo({
                  url: 'result',
                })
              }
    
            },it.data.unitTestTime*1000);
        }
      },1000)

  },
  clickOptions:function(e){

    if(flag_isCanTest == false){

      return
    }else{
      console.log("可以点击")
    }
    flag_isCanTest = false
    var index = e.currentTarget.dataset.bean
    console.log(e.currentTarget.dataset.bean)
    var answ = this.data.questions[this.data.nowQnum].answers[index]
    console.log(answ)
    //stop
    clearInterval(this.data.setInter_test)
    clearInterval(this.data.setInter_clock)
    this.setData({
      setInter_test:'',
      setInter_clock:'',
    })
    //console.log("当前在第"+(this.data.nowQnum+1)+"题")
    //判断对错
    //console.log("正确答案:"+this.data.questions[this.data.nowQnum].correct)
    if(answ == this.data.questions[this.data.nowQnum].correct){

      //正确
      console.log("回答正确")
      var c = this.data.isCorrect
      c[index] = 1
      this.setData({
        isCorrect:c,
      })
      //计算得分
      //本题目难度
      //console.log(this.data.showQuestion)
      var level = this.data.showQuestion.level
      var type = this.data.showQuestion.type
      console.log("本题目难度:"+level)
      console.log("本题目类型:"+type)
      var score = 0
      if(level == 3){
        score = 8
      }else if(level == 2){
        score = 7
      }else if(level == 1){
        score = 5
      }
      //保存分数
      if(type == '逻辑题'){
        app.globalData.luojiCorrectNum += 1
      }else if(type == '常识题'){
        app.globalData.changshiCorrectNum += 1
      }else if(type == '算术题'){
        app.globalData.suanshuCorrectNum += 1
      }
      app.globalData.score += score  
      console.log("当前得分:"+app.globalData.score)
      console.log("常识题共答对:"+app.globalData.changshiCorrectNum)
      console.log("算术题共答对:"+app.globalData.suanshuCorrectNum)
      console.log("逻辑题共答对:"+app.globalData.luojiCorrectNum)

    }else{

      //错误
      console.log("回答错误")
      var c = this.data.isCorrect
      c[index] = 2
      this.setData({
        isCorrect:c,
      })
      //getApp().globalData.age = this.data.ageStr;
     
      console.log("当前得分:"+app.globalData.score)
    }

    //console.log("测试结束")
    //判断是否测试结束
    if(this.data.nowQnum == this.data.totalQnum-1){

      console.log("测试结束")
                //测试结束
                //记录结束时间
                var endTime = Date.parse(new Date()); 
                console.log("endTime:"+endTime)
                app.globalData.endTime = endTime        
                back.stop()  
                clearInterval(this.data.setInter_test)
                clearInterval(this.data.setInter_clock)
                wx.redirectTo({
                  url: 'result',
                })
    }

    var that = this
    setTimeout(function () {

      back.stop()
      back.src = "pages/video/start.mp3";
      back.play();
      clearInterval(that.data.setInter_clock)
      that.setData({ 
        nowQnum:that.data.nowQnum + 1,
        setInter_clock:'',
        nowTestLeftTime:that.data.unitTestTime,
      })
      flag_isCanTest = true
      var num = that.data.nowQnum
          that.setData({ 
            showQuestion:that.data.questions[that.data.nowQnum],
            isCorrect:[0,0,0,0]
          });
          var she = that
          that.data.setInter_clock = setInterval(
            function(){
              she.setData({
                
                nowTestLeftTime:she.data.nowTestLeftTime - 1,
              })
            },1000)

            var it = that
            that.data.setInter_test = setInterval(
              function () {
  
                it.setData({ 
                  nowQnum:it.data.nowQnum + 1
                })
                console.log(it.data.setInter_test_num)
                if(it.data.nowQnum < it.data.totalQnum-1){
  
                  back.stop()
                  back.src = "pages/video/start.mp3";
                  back.play();
                  console.log("num:"+num)
                  it.setData({ 
                    showQuestion:it.data.questions[it.data.nowQnum],
          
                  });
  
                  //闹钟时间
                  clearInterval(it.data.setInter_clock)
                  it.setData({
                    setInter_clock:'',
                    nowTestLeftTime:5,
                  })
                  var he = it
                  it.data.setInter_clock = setInterval(
                    function(){
                      he.setData({
                        nowTestLeftTime:he.data.nowTestLeftTime - 1,
                      })
                    },1000
                  )
  
                }else{//结束
                  //clearInter
                  clearInterval(it.data.setInter_test)
                  clearInterval(it.data.setInter_clock)
                  it.setData({
                    setInter_clock:'',
                  })
                  console.log("测试结束")
                  //记录结束时间
                  var endTime = Date.parse(new Date()); 
                  console.log("endTime:"+endTime)
                  app.globalData.endTime = endTime
                  back.stop()  
                  wx.redirectTo({
                  url: 'result',
                  })
                }
      
              },it.data.unitTestTime*1000);    
    }, 2000);
 
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})