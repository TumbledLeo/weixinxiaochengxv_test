// miniprogram/pages/show/show.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    or:"false"
    // , openid:""
    ,shoppingType:'',
    selectSome: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })

    const db = wx.cloud.database()
    db.collection('shoppingType').where({
      //_openid: this.data.openid
    }).get({
      success: res => {
        wx.hideLoading()
        this.setData({
         // shoppingType: JSON.stringify(res.data, null, 3)
           shoppingType: res.data
        })
        console.log('[数据库] [查询记录] 成功: ', res)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
    let arry = [];

    db.collection('shoppingMall').where({
      //_openid: this.data.openid
    }).get({
      success: res => {
        res.data.filter(item => {

          if (item.category == 'bedroom') {
            arry.push(item);
          }
        })
        this.setData({
          selectSome: arry
        })
        console.log('[数据库] [查询记录] 成功: ', arry)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
    //获取openid
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        app.globalData.openid = res.result.openid
        // 获取数据库里面保存的购物车内容
        db.collection('buycar').where({
          _openid: 'app.globalData.openid' // 填入当前用户 openid
        }).get().then(res => {
          // console.log(app.globalData.openid + '-------------------------------');
          res.data.filter(item => {
            if (item._id == app.globalData.openid) {
              app.globalData.shop = item.cargoods;
              app.globalData.buycar = item.count
            } else {
              app.globalData.shop = [];
              app.globalData.buycar = 0;
            }
          });
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
    
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
    console.log('我就想看看这个方法触发了没有');
    wx.stopPullDownRefresh();
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

  },

  /*
  *点击出现弹窗导航
  */ 
  navshow:function(){
   
    this.setData({
      or:true
    });
  },
  navclose:function(){
    
    this.setData({
      or:false
    });
  },
  // onQuery: function () {
  //   const db = wx.cloud.database()
  //   // 查询当前用户所有的 counters
  //   db.collection('counters').where({
  //     _openid: this.data.openid
  //   }).get({
  //     success: res => {
  //       this.setData({
  //         queryResult: JSON.stringify(res.data, null, 3)
  //       })
  //       console.log('[数据库] [查询记录] 成功: ', res)
  //     },
  //     fail: err => {
  //       wx.showToast({
  //         icon: 'none',
  //         title: '查询记录失败'
  //       })
  //       console.error('[数据库] [查询记录] 失败：', err)
  //     }
  //   })
  // },
 
})
