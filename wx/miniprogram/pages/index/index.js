const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

    ranks:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    wx.cloud.callFunction({
      name: 'getRanks',  // 对应云函数名
      success: res => {
        console.log(res.result)
        this.setData({
          ranks:res.result
        })
      },
      fail: err => {
        console.error(err);
      }
    })
  },
  clickGo:function(){

    console.log("开始测试")
    app.globalData.changshiNum =0
    app.globalData.suanshuNum=0
    app.globalData.luojiNum=0
    app.globalData.score=0
    app.globalData.changshiCorrectNum=0
    app.globalData.suanshuCorrectNum=0
    app.globalData.luojiCorrectNum=0
    app.globalData.startTime=0
    app.globalData.endTime=0
    app.globalData.totoalNum=0,

    wx.navigateTo({
      url:'start'
    })
  
    /*
    var that = this;
      //将计时器赋值给setInter
      that.data.setInter = setInterval(
          function () {
              var numVal = that.data.num + 1;
              that.setData({ num: numVal });
              console.log('setInterval==' + that.data.num);
          }
    , 2000);
    */
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