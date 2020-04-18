// miniprogram/pages/index/result.js
const back = wx.createInnerAudioContext();
const app = getApp()
const F2 = require('@antv/wx-f2');
const screenWidth_px = wx.getSystemInfoSync().windowWidth; 
const onepx = 1 / 750 * wx.getSystemInfoSync().windowWidth;
let chart = null;
 
function initChart(canvas, width, height) { // 使用 F2 绘制图表
  
  var pages = getCurrentPages();
  var currPage = pages[pages.length - 1]
  const map =currPage.data.map
  const data = currPage.data.myInfo
  
  /*var data=[{
      item: '逻辑',
      //user: '用户 A',
      score: 70
    }, {
      item: '算术',
      //user: '用户 A',
      score: 60
    }, {
      item: '常识',
      //user: '用户 A',
      score: 50
    },
  ]
  */
  const chart = new F2.Chart({
    el: canvas,
    width,
    height
  });
  
  chart.coord('polar');
  chart.source(data, {
    score: {
      min: 0,
      max: 120,
      nice: false,
      tickCount: 4
    }
  });
  chart.tooltip(false);
  /*
  chart.tooltip({
    custom: true, // 自定义 tooltip 内容框
    onChange: function onChange(obj) {
      const legend = chart.get('legendController').legends.top[0];
      const tooltipItems = obj.items;
      const legendItems = legend.items;
      const map = {};
      legendItems.forEach(function(item) {
        map[item.name] = _.clone(item);
      });
      tooltipItems.forEach(function(item) {
        const name = item.name;
        const value = item.value;
        if (map[name]) {
          map[name].value = value;
        }
      });
      legend.setItems(_.values(map));
    },
    onHide: function onHide() {
      const legend = chart.get('legendController').legends.top[0];
      legend.setItems(chart.getLegendItems().country);
    }
  });
  */
  
  
  chart.axis('score', {
    /*
    label: function label(text, index, total) {
      if (index === total - 1) {
        return null;
      }
      return {
        
        stroke: '#EEC23C',//刻度颜色
        top: true
 
      };
    },
    */
   label: function label(text, index, total) {
    return null;
   },
    grid: {
      stroke: '#FFFFFF',//轴线显色
      lineDash: null,
      type: 'arc' // 弧线网格
    }
  });
  chart.axis('item', {
    label: function label(text, index, total) {
    
    return {
      fontWeight: 'lighter',
      fontSize:'16',//字体大小
      stroke: '#FFFFFF',//坐标描述颜色
      fill:'#FFFFFF',
      top: true

    };
    
   /*
    const textCfg = {
    //fill: this.color.font,
    };
    // textCfg.text = dateFormat(Number(text), 'MM-dd');
    textCfg.fill = '#FFFFFF';
    //textCfg.stroke = '#FFFFFF';均可
    return textCfg;
    */
  },
   /*
   
   */
    grid: {
      stroke: '#FFFFFF',//轴线显色
      lineDash: null,
     
    },
    
  })
  //chart.area().position('item*score').color('#d2b576');//#EEC23C
  chart.line().position('item*score').color('#EEC23C');
  chart.point().position('item*score').color('#EEC23C')
    .style({
      stroke: '#fff',
      lineWidth: 1
    });
  chart.area().position('item*score')
  .color('#EEC23C')
  //.color('l(90) 0:#86CDF3 1:#C1EDFC') // 面积区域背景色渐变
  .style({ fillOpacity: 0.6 })  // 背景色透明度
  .shape('smooth')
  
  chart.render();
}
Page({

  /**
   * 页面的初始数据
   */
  data: {

    awardLevel:0,
    awardName:'',
    awardImg:'',
    cap:'',
    name:'徐逸楠',
    imageFile:'',
    //finalScore:0
    myInfo:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    back.stop();
    back.src = "pages/video/result.mp3";
    back.play();
    this.ecComponent = this.selectComponent('#mycanvas');
    this.ecComponent.init(initChart);

    console.log("年龄:"+app.globalData.age)
    console.log("地区:"+app.globalData.area)
    console.log("姓名:"+app.globalData.name)
    console.log("得分:"+app.globalData.score)
    console.log("常识题共有:"+app.globalData.changshiNum)
    console.log("算术题共有:"+app.globalData.suanshuNum)
    console.log("逻辑题共有:"+app.globalData.luojiNum)
    console.log("常识题共答对:"+app.globalData.changshiCorrectNum)
    console.log("算术题共答对:"+app.globalData.suanshuCorrectNum)
    console.log("逻辑题共答对:"+app.globalData.luojiCorrectNum)
    console.log("题目共有:"+app.globalData.totoalNum)
    console.log("每个题目计时:"+app.globalData.unitTestTime)
    console.log("开始时间:"+app.globalData.startTime)
    console.log("结束时间:"+app.globalData.endTime)
    

    //根据时间加分
    var useTime = Math.floor((app.globalData.endTime - app.globalData.startTime)/1000)
    console.log("花费: "+useTime+" 秒")
    //mock
    //useTime = 130
  
    this.setData({
      useTime:Math.floor(useTime/60)+" 分 "+useTime%60+" 秒",
      name:app.globalData.name,
    })

    var standrdTime = app.globalData.totoalNum*app.globalData.unitTestTime
    console.log("标准时间: "+standrdTime+" 秒")
    var finalScore = app.globalData.score
    var bonusScore_time = 0
    var bonusScore_age = 0

    if(useTime <= standrdTime/4){

      finalScore += 20
      bonusScore_time = 20

    }else if(useTime <= standrdTime/2){

      finalScore += 10
      bonusScore_time = 10
    }

    //根据年龄加分
    if(app.globalData.age == '4周岁'){

      finalScore += 20
      bonusScore_age = 20

    }else if(app.globalData.age == '5周岁'){

      finalScore += 10
      bonusScore_age = 10
    }
    console.log("最终得分:"+finalScore)


    //mock数据
    //finalScore = 123

    var awardLevel = 0
    var awardName = ''
    var cap = ''


    if(finalScore >= 120){
      awardLevel = 3
      awardName = "超棒"
      cap = "../../images/cap3.png"
    }else if(finalScore >= 100){

      awardLevel = 2
      awardName = "优秀"
      cap = "../../images/cap2.png"
    }else if(finalScore >= 80){
      awardLevel = 1
      awardName = "真棒"
      cap = "../../images/cap1.png"
      
    }else{
      awardLevel = 0
      awardName = "加油"
    }
    this.setData({
      awardLevel:awardLevel,
      awardImg:"../../images/award"+awardLevel+".png",
      awardName:awardName,
      finalScore:finalScore,
      cap:cap,
    })

    //计算雷达图
    var score_changshi = 100
    var score_suansu = 100
    var score_luoji = 100
    if(app.globalData.changshiNum > 0){

      score_changshi = Math.round(app.globalData.changshiCorrectNum*100/app.globalData.changshiNum)
    } 
    if(app.globalData.suanshuNum > 0){
      score_suansu = Math.round(app.globalData.suanshuCorrectNum*100/app.globalData.suanshuNum)
    } 
    if(app.globalData.luojiNum > 0){
      score_luoji = Math.round(app.globalData.luojiCorrectNum*100/app.globalData.luojiNum)
    } 
    if(score_changshi <= 50){
      score_changshi = 50
    }
    if(score_suansu <= 50){
      score_suansu = 50
    }
    if(score_luoji <= 50){
      score_luoji = 50
    }
    
    console.log("常识得分:"+score_changshi)
    console.log("逻辑得分:"+score_luoji)
    console.log("算术得分:"+score_suansu)

    /*
    console.log("常识题共有:"+app.globalData.changshiNum)
    console.log("算术题共有:"+app.globalData.suanshuNum)
    console.log("逻辑题共有:"+app.globalData.luojiNum)
    console.log("常识题共答对:"+app.globalData.changshiCorrectNum)
    console.log("算术题共答对:"+app.globalData.suanshuCorrectNum)
    console.log("逻辑题共答对:"+app.globalData.luojiCorrectNum)
    */
    this.setData({
      myInfo:[{
        item: '逻辑',
        score: score_luoji
      }, {
        item: '算术',
        score: score_suansu
      }, {
        item: '常识',
        score: score_changshi
      },
    ]
    })

    wx.cloud.callFunction({
      name: 'getList',  // 对应云函数名
      data:{
        age:app.globalData.age,
        area:app.globalData.area,
        name:app.globalData.name,
        score:app.globalData.score,
        bonusScore_time:bonusScore_time,
        bonusScore_age:bonusScore_age,
        finalScore:finalScore,
        useTime:Math.floor(useTime/60)+"分"+useTime%60+"秒",
      },
      success: res => {
        console.log(res.result)

        //this.drawShareImg()
        console.log(res.result)//{list: 2, winNum: -100}
        var rank = ''
        if(res.result.winNum > 0 && res.result.winNum<=50){
          rank = '第 '+ res.result.list+' 名 战胜了 '+res.result.winNum+'% 的选手'
        }else{
          rank = '第 '+ res.result.list+' 名'
        }
       
        this.setData({
          list:rank
        })
     
      },
      fail: err => {
        console.error(err);
      }
    })
   
   
    
  },
  /*
  drawShareImg:function(){

    //合成分享图片
    console.log("合成分享图片")
    const ctx = wx.createCanvasContext('shareCanvas')
    ctx.fillStyle="#5ED3FF";
    ctx.fillRect(0,0,750*onepx,600*onepx);
    ctx.drawImage(this.data.awardImg, 200*onepx,30*onepx, 350*onepx, 283*onepx)  
    ctx.drawImage(this.data.cap, 315*onepx,333*onepx, 120*onepx, 120*onepx) 
    ctx.draw() 
    
    var that = this
    wx.canvasToTempFilePath({
      canvasId: 'shareCanvas',
      destWidth:750*onepx,
      destHeight:600*onepx,
      success: function (res) {
        console.log('完整图片转换成功')
        that.setData({
          imageFile:res.tempFilePath
        })
        
      }
    })
    
  },
  */
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
  promisify:function(f) {
    return function () {
        let args = Array.prototype.slice.call(arguments);
        return new Promise(function (resolve, reject) {
            args.push(function (err, result) {
                if (err) reject(err);
                else resolve(result);
            });
            f.apply(null, args);
        });
    }
  },
  roundRect:function(ctx, x, y, w, h, r, c = '#fff') {
    if (w < 2 * r) { r = w / 2; }
    if (h < 2 * r) { r = h / 2; }
 
    ctx.beginPath();
    ctx.fillStyle = c;
 
    ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5);
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.lineTo(x + w, y + r);
 
    ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2);
    ctx.lineTo(x + w, y + h - r);
    ctx.lineTo(x + w - r, y + h);
 
    ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5);
    ctx.lineTo(x + r, y + h);
    ctx.lineTo(x, y + h - r);
 
    ctx.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI);
    ctx.lineTo(x, y + r);
    ctx.lineTo(x + r, y);
 
    ctx.fill();
    ctx.closePath();
  },
  drawFullImg:function(){

    var that = this
    this.ecComponent = this.selectComponent('#mycanvas');
    wx.canvasToTempFilePath({
      canvasId: 'mycanvas',
      success: function (res) {

        var canvasImg = res.tempFilePath
        console.log(canvasImg)

        //画完成的长图
        const ctx = wx.createCanvasContext('downCanvas')
        ctx.fillStyle="#5ED3FF";
        ctx.fillRect(0,0,750*onepx,2000*onepx);
        ctx.drawImage(that.data.awardImg, 150*onepx, 20*onepx, 450*onepx, 363*onepx)  
        
        //height:180rpx;width:250rpx;font-size: 120rpx;margin-top: 50rpx;
        
        //ctx.setTextAlign('center')    // 文字居中
        ctx.setFillStyle('#FFFFFF')  // 文字颜色：黑色
        ctx.setFontSize(120*onepx)         // 文字字号：22px
        console.log(ctx.measureText(that.data.finalScore).width)
        console.log(750*onepx)
        ctx.fillText(that.data.finalScore, (750*onepx - ctx.measureText(that.data.finalScore+ '').width) / 2, 210*onepx);//y是左下角
       
        //awardLevel height:60rpx; width:250rpx; margin-top: 5rpx;
        ctx.setFillStyle('#FFFFFF')  // 文字颜色：黑色
        ctx.setFontSize(40*onepx)         // 文字字号
        ctx.fillText(that.data.awardName, (750*onepx - ctx.measureText(that.data.awardName).width) / 2, 300*onepx);//y是左下角


        //皇冠 margin-top: 30rpx;width:150rpx;height:150rpx;
        ctx.drawImage(that.data.cap, 300*onepx, 400*onepx, 150*onepx, 150*onepx)  
        //ctx.stroke()
        //.title width:320rpx;height:100rpx;margin-top: 10rpx;
        //font-size: 60rpx;background: #37AEDA;border-radius: 50rpx;
        that.roundRect(ctx,215*onepx, 563*onepx,320*onepx, 100*onepx,50*onepx,'#37AEDA')
        ctx.setFillStyle('#FFFFFF')  // 文字颜色：黑色
        ctx.setFontSize(60*onepx)         // 文字字号
        ctx.fillText(that.data.name, (750*onepx - ctx.measureText(that.data.name).width) / 2, 633*onepx);//y是左下角
        //.titleTxt{margin-top: 30rpx;font-size:40rpx;margin-bottom: 20rpx;
        
        ctx.setFontSize(40*onepx)         // 文字字号
        ctx.fillText('聪明儿童-韦氏题库智商测试成绩:', (750*onepx - ctx.measureText('聪明儿童-韦氏题库智商测试成绩:').width) / 2, 743*onepx);//y是左下角
        // font-size:44rpx;
        ctx.setFontSize(44*onepx)         // 文字字号
        var str0 = "得分:  "+that.data.finalScore+" 分"
        ctx.fillText( str0, 120*onepx, 823*onepx);//y是左下角

        var str1 = "时间:  "+that.data.useTime
        ctx.fillText( str1, 120*onepx, 903*onepx);//y是左下角

        var str1 = "排名:  "+that.data.list
        ctx.fillText( str1, 120*onepx, 983*onepx);//y是左下角

        ctx.setFillStyle('#FFFFFF')

        //that.roundRect(ctx,0,3200*onepx,750*onepx,200*onepx,0,'#37AEDA')

        ctx.setFontSize(40*onepx)         // 文字字号
        var strend = "聪明儿童智商测试"
        ctx.fillText( strend, (750*onepx - ctx.measureText( strend).width) / 2, 1950*onepx);//y是左下角
        //ctx.stroke()

        ctx.drawImage(canvasImg, 0*onepx, 1000*onepx, 750*onepx, 600*onepx)  

        //二维码
        that.roundRect(ctx,250*onepx, 1600*onepx,250*onepx, 250*onepx,125*onepx,'#FFFFFF')
        
        ctx.drawImage('../../images/q.png', 250*onepx, 1600*onepx, 250*onepx, 250*onepx) 
        
        

        ctx.draw()
        //that.ecComponent2 = this.selectComponent('#mycanvas');
        wx.canvasToTempFilePath({
          canvasId: 'downCanvas',
          success: function (res) {
            console.log('完整图片转换成功')
            var fullImg = res.tempFilePath
            wx.saveImageToPhotosAlbum({
              filePath: fullImg,
              success:function (data) {
              console.log(data);
              wx.showToast({
                title: '保存成功',
              })
              },
              fail:function (err) {
              console.log(err);}
            })
          },fail: function (res) {
           
            console.log(res)
          }
        })
       
      },

      fail: function (res) {
        console.log("雷达图转图像失败")
        console.log(res)
      }
    }, this.ecComponent)
    

  },
 
  clickSave:function(){

    console.log("click save")
    this.drawFullImg()
   
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

    console.log("on share")
    
    return {
      title: app.globalData.name+'刚完成聪明儿童智商测试哦，你也测测看吧',
      path: '/pages/index/index',
      imageUrl: this.data.imageFile
    }
    
    
  },
  clickHome:function(){

    wx.redirectTo({
      url: 'index',
    })
  },
  cToFile:function(option, context) {
    return new Promise((resolve, reject) => {
      wx.canvasToTempFilePath({
        ...option,
        success: resolve,
        fail: reject,
      }, context)
    })
  }
})