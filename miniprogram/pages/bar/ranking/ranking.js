// miniprogram/pages/bar/ranking/ranking.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movie: [],
    total: 0,
    copy: '',
    num: 10,
    floorstatus: ''
   // ide:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    let arry = [];
    wx.showLoading({
      title: '加载中',
    })

    wx.request({
      //  url: 'https://douban.uieee.com/v2/movie/in_theaters?city=北京&start=0&count=10',
      url: 'https://douban-api.uieee.com/v2/movie/top250',
      data: {
        'start': '0',
        'count': '10'
      },
      header: {
        //'Content-Type': 'application/json'
        'Content-Type': 'json;charset=UTF-8;'
      },
      method: 'GET',
      success: function (res) {
        wx.hideLoading()
        // 将获取到的json数据，存在名字叫doubanMovie的这个数组中
        //  res.data.subjects.filter(item => {
        //    arry.push(item.src);
        //    that.setData({
        //      genres: item.genres,
        //      title: item.title,
        //      durations: item.durations,

        //    });
        //  });
        //  JS对象数组转JSON
        var moviedb = JSON.stringify(res.data.subjects);
        that.setData({
          //json字符串转数组
          movie: JSON.parse(moviedb),
          total: res.data.total
        })
        //this.data.total = res.data.total
        // console.log(that.data.total);

      },
      fail: function ({ errMsg }) {
        console.log('request fail', errMsg)

      }
    })
  },
   /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    let arry = [];
    if (that.data.num < this.data.total) {
      that.data.num = that.data.num + 10;
      wx.request({
        //  url: 'https://douban.uieee.com/v2/movie/in_theaters?city=北京&start=0&count=10',
        url: 'https://douban.uieee.com/v2/movie/top250',
        data: {
          'start': '0',
          'count': that.data.num
        },
        header: {
          //'Content-Type': 'application/json'
          'Content-Type': 'json;charset=UTF-8;'
        },

        method: 'GET',
        success: function (res) {
          wx.hideLoading()
          //  JS对象数组转JSON
          var moviedb = JSON.stringify(res.data.subjects);
          that.setData({
            //json字符串转数组
            movie: JSON.parse(moviedb),
          })
          // console.log(that.data.movie);
          console.log(that.data.num)
        },
        fail: function ({ errMsg }) {
          console.log('request fail', errMsg)
        }
      })
    } else {
      wx.showToast({
        title: '这就是全部啦',
        icon: 'none',
      })
    }

  },
  copy: function (e) {
    console.log(e);
    this.setData({
      copy: e.currentTarget.dataset.text,
    });
    wx.setClipboardData({
      data: this.data.copy,
      success(res) {
        wx.getClipboardData({
          success(res) {
            //  console.log(res.data) // data
          }
        })
      }
    })
  },
  goTop: function (e) {
    wx.pageScrollTo({
      scrollTop: 0,
    })
  },
  // 获取滚动条当前位置
  // onPageScroll: function (e) {
  //   // console.log(e)
  //   if (e.scrollTop > 100) {
  //     this.setData({
  //       floorstatus: true
  //     });
  //   } else {
  //     this.setData({
  //       floorstatus: false
  //     });
  //   }
  // },
  onPageScroll: function (e) {
    if (e.scrollTop = 100) {
      app.globalData.floorstatus = true
     
    } else {
      app.globalData.floorstatus = false
    }
    setTimeout(() => {
      this.setData({
        floorstatus: app.globalData.floorstatus
      });
    }, 0);
  },
  getmore: function (e) {
    console.log(e);
    // this.setData({
    //   ide: e.currentTarget.dataset.text
    // })
    let ide = e.currentTarget.dataset.text;
    wx.navigateTo({
      url: '../search/search?id=' + ide,

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

  },

 
 

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})