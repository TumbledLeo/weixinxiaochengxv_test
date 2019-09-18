// 购物车页面
const app = getApp()
Page({
  data: {
    cargoods:[],
    allMoney:0,
    //数据库中保存的物品数量
    count:0,
    prices:0,
    alls:0,
  },
  onLoad: function (options) {
    //将全局数据渲染到当前页面
    this.setData({
      cargoods: app.globalData.shop
    });
    let all = 0,count = 0;
    app.globalData.shop.filter(item => {
      let prices = item.num * item.price;
      all = all + prices;
      count = count + item.num;
      
      this.setData({
        prices :item.price * item.num,
      });
    });
    this.setData({
      allMoney: this.data.allMoney + all,
      count: count,
    });
  },
  // 将购物车内容保存到数据库
  save:function(){
    const db = wx.cloud.database()
    db.collection('buycar').doc(app.globalData.openid).set({
      data: {
        count:this.data.count,
        cargoods: this.data.cargoods,
        allMoney: this.data.allMoney,
      },
      success: res => { 
        wx.showToast({
          title: '展览页保存成功',
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '新增记录失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })
  },
  //删除当前购物车物品
  deletes:function(e){
    let id = e.target.id;
    this.data.cargoods.filter(item=>{
      if (id == this.data.cargoods.indexOf(item)){
        this.data.cargoods.splice(id, 1);
        app.globalData.shop = this.data.cargoods;
        this.setData({
          cargoods : this.data.cargoods,
          count:this.data.count-item.num ,
          allMoney: this.data.allMoney - item.num * item.price,
        });

        wx.showToast({
          title: '删除成功',
        })
      }
    });
    app.globalData.buycar = this.data.count;
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