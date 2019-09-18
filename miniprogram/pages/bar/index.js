// import * as echarts from '../../ec-canvas/echarts';

// let chart = null;

// function initChart(canvas, width, height) {
//   chart = echarts.init(canvas, null, {
//     width: width,
//     height: height
//   });
//   canvas.setChart(chart);

//   var option = {
//    backgroundColor: '#2c343c',
//     series: [
//       {
       
//         name: '访问来源',
//         type: 'pie',
//         radius: '55%',
//         data: [
//           { value: 2, name: '视频广告' },
//           { value: 3, name: '联盟广告' },
//           { value: 4, name: '邮件营销' },
//           { value: 5, name: '直接访问' },
//           { value: 6, name: '搜索引擎' }
//         ],
//         roseType: 'angle',
//         label: {
//           normal: {
//             textStyle: {
//               color: 'rgba(255, 255, 255, 0.3)'
//             }
//           }
//         },
//         labelLine: {
//           normal: {
//             lineStyle: {
//               color: 'rgba(255, 255, 255, 0.3)'
//             }
//           }
//         },
//         itemStyle: {
//           normal: {
//             color: '#c23531',
//             shadowBlur: 200,
//             shadowColor: 'rgba(0, 0, 0, 0.5)'
//           }
//         }
//       },
      
//     ],
    
    
//   }
  
//   chart.setOption(option);
//   return chart;
// }
const app = getApp()
Page({
  
  data: {
    //ec 是一个我们在 index.js 中定义的对象，它使得图表能够在页面加载后被初始化并设置
    // ec: {
    //   onInit: initChart
    // },
    movie:[],
    total:0,
    copy:'',
    num:10,
    floorstatus:''
   // ide:'',
  },
  onReady() {
  //   setTimeout(function () {
  //     // 获取 chart 实例的方式
  //  //   console.log(chart)
  //   }, 2000);
  },
  onLoad: function () {
     var that = this;
     let arry = [];
    
    wx.showLoading({
      title: '加载中',
    })
     wx.request({
      //  url: 'https://douban-api.uieee.com/v2/movie/in_theaters?city=北京&start=0&count=10',
       url: 'https://douban-api.uieee.com/v2/movie/in_theaters',
       data:{
         'city':'北京' , 
         'start':'0', 
         'count':'10'
       },
       header: {
         //'Content-Type': 'application/json'
         'Content-Type': 'json'
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
          // var moviedb = JSON.stringify(res.data.subjects);
         that.setData({
           //json字符串转数组
         //  movie: JSON.parse(moviedb) ,
           movie: res.data.subjects,
           total: res.data.total,    
         })    
       },
       fail: function ({ errMsg }) {
         console.log('request fail', errMsg)
       }
     })
   
  },
  onReachBottom: function () {
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    let arry = [];

    
    if (that.data.num<this.data.total){
      that.data.num = that.data.num + 10;
      wx.request({
        //  url: 'https://douban.uieee.com/v2/movie/in_theaters?city=北京&start=0&count=10',
        url: 'https://douban.uieee.com/v2/movie/in_theaters',
        data: {
          'city': '北京',
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
    }else{
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
  goTop:function(e){
    wx.pageScrollTo({
      scrollTop: 0,
    })
  },
  // 获取滚动条当前位置
  onPageScroll: function (e) {
   // console.log(e)
    if (e.scrollTop > 100) {
      app.globalData.floorstatus=true
    } else {
      app.globalData.floorstatus = false
    }
    setTimeout(()=>{
      this.setData({
        floorstatus: app.globalData.floorstatus
      });
    },0);
    // this.setData({
    //   floorstatus: app.globalData.floorstatus
    // });
  },
  getmore:function(e){
    console.log(e);
    let ide='';
    // this.setData({
    //   ide:e.currentTarget.dataset.text
    // })
    ide = e.currentTarget.dataset.text;
    wx.navigateTo({
      url: 'search/search?id='+ide,
      
    })
  }
});
