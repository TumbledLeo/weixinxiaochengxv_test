// miniprogram/pages/bar/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    aboutMore:'',
    title:'',
    //blooper_urls:'',
    //bloopers:'',
    casts:'',
    countries:'',
    photos:'',
    //trailer_urls:'',
    summary:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  console.log(options.id);
    var that = this;
    let arry=[];
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
    
      url: 'https://douban-api.uieee.com/v2/movie/subject/' + options.id,
      // data: {
      //   'start': '0',
      //   'count': '10'
      // },
      header: {
        //'Content-Type': 'application/json'
        'Content-Type': 'json;charset=UTF-8;'
      },
      method: 'GET',
      success: function (res) {
        wx.hideLoading()
        console.log(res.data);
       // var aboutMores = JSON.stringify(res.data);
        res.data.blooper_urls.filter(item=>{
         var blooper_urls1 = item.replace(/http/g, "https");
          arry.push(blooper_urls1);
       });
        
        that.setData({
          //json字符串转数组
        //  aboutMore: JSON.parse(aboutMores),
        //  aboutMore: res.data,
          title: res.data.title,

         // blooper_urls: arry,
         // bloopers: res.data.bloopers,
          casts: res.data.casts,
          countries: res.data.countries,
          photos: res.data.photos,
          summary:res.data.summary,
         // trailer_urls: res.data.trailer_urls,
        })
        // console.log(that.data.movie);

      },
      fail: function ({ errMsg }) {
        console.log('request fail', errMsg)

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