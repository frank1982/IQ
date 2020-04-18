// miniprogram/pages/index/start.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isCanClick:false,
    isAgeBoxShow:false,
    isAreaBoxShow:false,
    isAlertBoxShow:false,
    name:'',
    ageStr:'请输入孩子年龄(周岁)',
    areaStr:'请输入所在地区',
    alertInfo:'',
    areaList:[
      '北京',
      '天津',
      '上海',
      '重庆',
      '河北',
      '山西',
      '辽宁',
      '吉林',
      '黑龙江',
      '江苏',
      '浙江',
      '安徽',
      '福建',
      '江西',
      '山东',
      '河南',
      '湖北',
      '湖南',
      '广东',
      '海南',
      '四川',
      '贵州',
      '云南',
      '陕西',
      '甘肃',
      '青海',
      '台湾',
      '内蒙古',
      '广西',
      '西藏',
      '宁夏',
      '新疆',
      '香港',
      '澳门'
    ],
    existName:'',
    existAge:'',
    existArea:'',
  },
  inputAge:function(){

    this.setData({
      isAgeBoxShow:true,
    })
  },
  inputArea:function(){

    this.setData({
      isAreaBoxShow:true,
    })
  },
  closeAgeBox:function(){
    this.setData({
      isAgeBoxShow:false,
    })
  },
  closeAreaBox:function(){
    this.setData({
      isAreaBoxShow:false,
    })
  },
  clickAgeItem:function(e){

    //console.log(e.currentTarget.dataset.bean)
    var num = e.currentTarget.dataset.bean
    this.setData({
      ageStr:num+"周岁",
      isAgeBoxShow:false,
    })
  },
  clickAreaItem:function(e){

    console.log(e.target.dataset.bean)
    this.setData({
      areaStr:e.target.dataset.bean,
      isAreaBoxShow:false,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    
      wx.cloud.callFunction({
      name: 'getReg',  // 对应云函数名
      success: res => {
        console.log(res.result)
        if(res.result.code == 111){//已存在
          this.setData({
            name:res.result.data.name,
            ageStr:res.result.data.age,
            areaStr:res.result.data.area,
            
          })
        }
        this.setData({
          isCanClick:true,
        })
      },
      fail: err => {
        console.error(err);
      }
    })
    
  },
  clickKnow:function(){
    this.setData({
      isAlertBoxShow:false,
    })
  },
  clickSure:function(){
    if(this.data.isCanClick == false){
     
      return
    }
    this.setData({
      isCanClick:false
    })
    //检查输入
    var name = this.data.name
    if(name.length < 2){
     
      this.setData({
        alertInfo:"请正确输入孩子的姓名",
        isAlertBoxShow:true,
        isCanClick:true
      })
      return
    }
    if(this.isAllChinese(name) == false || name == ''){
      console.log("不全是中文")
      this.setData({
        alertInfo:"请正确输入孩子的姓名",
        isAlertBoxShow:true,
        isCanClick:true
      })
      return
    }
    if(this.data.ageStr == "请输入孩子年龄(周岁)"){
      this.setData({
        alertInfo:"请输入孩子的年龄",
        isAlertBoxShow:true,
        isCanClick:true
      })
      return
    }
    if(this.data.areaStr == "请输入所在地区"){
      this.setData({
        alertInfo:"请输入所在地区",
        isAlertBoxShow:true,
        isCanClick:true
      })
      return
    } 

    //检查通过
    getApp().globalData.name = name;
　　 getApp().globalData.age = this.data.ageStr;
    getApp().globalData.area = this.data.areaStr;
    //注册或更新
    wx.cloud.callFunction({
      name: 'reg',  // 对应云函数名
      data:{
        name:name,
        age:this.data.ageStr,
        area:this.data.areaStr,
      },
      success: res => {
        console.log(res.result)
        wx.navigateTo({
          url:'test'
        })
        
      },
      fail: err => {
        console.error(err);
      }
    })
   
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  isAllChinese: function (temp) {
    var re = /[^\u4e00-\u9fa5]/;
    if (re.test(temp)) return false;
    return true;
  },
  nameInput: function (e) {
    this.setData({
      name: e.detail.value
    })
    console.log(this.data.name)
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