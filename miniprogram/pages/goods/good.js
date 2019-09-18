// 物品详情页面
const app = getApp()
Page({
  data: {
    arr:[],
    num:0,
    //商品库存
    count:0,
    //圆点购物车数量
    buycar:'',
    move:''
  },
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    const db = wx.cloud.database()
    //去所有商品里面查找相应id的物品
    db.collection('shoppingMall').where({
    }).get({
      success: res => {
       //根据id 选择相应的产品.这里有两种方法，一种直接给data里面的属性赋值，另一种添加在一个数组中，最后setdata里面设置一下数组数据即可。
        res.data.filter(item=>{
          if (item._id == options.id) {
            this.setData({             
              arr:item,
              count:item.count
            })
          } 
        });
        wx.hideLoading()
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
    this.setData({
      buycar: app.globalData.buycar,
    });
  },
  reduce:function(){
    if(this.data.num>0){
      this.setData({
        num: this.data.num - 1
      });
    }else{
      wx.showToast({
        title: '不可以再少了',
        icon:'none',
       
      })
    }
    
  },
  add:function(){
    if (this.data.num < this.data.count){
      this.setData({
        num: this.data.num +1
      });
    }else{
      wx.showToast({
        title: '库存不够了',
        icon: 'none',
      })
    }
  },
  buy:function(){
    wx.showToast({
      title: '库存已减',
      icon:'success'
    }) 
    //购物车数量更新
    app.globalData.buycar = app.globalData.buycar + this.data.num
    this.setData({
      buycar: app.globalData.buycar,
      move:true
    });
    //更新数据库内存
    // const db = wx.cloud.database()
      // db.collection('shoppingMall').doc(this.data.arr._id).update({
      //   data: {
      //     count: newCount
      //   },
      //   success: res => {
      //     this.setData({
      //       count: newCount
      //     })
      //     console.log('更改成功');
      //   },
      //   fail: err => {
      //     icon: 'none',
      //       console.error('[数据库] [更新记录] 失败：', err)
      //   }
    // })
    const newCount = this.data.count - this.data.num
    this.setData({
      count: newCount
    })
    wx.cloud.callFunction({
      name: 'sum',
      // 传给云函数的参数
      data: {
        count: newCount,
        _id: this.data.arr._id
      },
      success: function (res) {
        console.log(res)
      },
      fail: console.error
    })
    //更新购物车
    let oneshop = [];
    let find = false;
    if (!app.globalData.shop==''){
      app.globalData.shop.filter(item=>{
        if (item.name == this.data.arr.name){
          item.num +=this.data.num
          find=true;
        }
      })
      if(!find){
        let str = { name: this.data.arr.name, num: this.data.num , img:this.data.arr.img[0],price:this.data.arr.price}
        app.globalData.shop.push(str);
      }
      
    }else{
      app.globalData.kong = true;
      let str = { name: this.data.arr.name, num: this.data.num, img: this.data.arr.img[0], price: this.data.arr.price}
     // oneshop.push(str);
      app.globalData.shop.push(str);
    }
    //重置选择数量
    this.setData({
      num: 0,
    });
  },
  shop:function(){
    this.setData({
      move: false,
    });
    wx.navigateTo({
      url: '../shop/shop',
      success: function (res) {
      }
    })
  },
 
  onQuery: function () {
    
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