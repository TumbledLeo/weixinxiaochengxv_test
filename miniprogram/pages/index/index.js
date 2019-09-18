//index.js
const app = getApp()
Page({
  onShareAppMessage: function (res) {
    return {
      title: '一个用来自娱自乐的小程序',
      path: '/pages/index/index',
      success: function () { },
      fail: function () { }
    }
  },
  data: {
    avatarUrl: './user-unlogin.png',
   // userInfo: {},
    userName:'点击头像登录',
    logged: false,
   //正式页面
    topimg:'https://6669-first-test-fpq61-1259603819.tcb.qcloud.la/topimg.jpg?sign=c5d74427e5b10b97822a03fda958717f&t=1565233391',
    date:'',
    dates:'',
    info:'留言',
    btn:true,
    says:'',
    words:[],
    textvalue:''
  },

  onLoad: function () {
    wx.showLoading({
      title: '加载中',
    })
    wx.setNavigationBarTitle({
      title: '欢迎~'
    })
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ffffff',
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    })
    //设置分享
    wx.showShareMenu({
      withShareTicket: true
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                //userInfo: res.userInfo,
                userName: res.userInfo.nickName,
                btn:false
              })

            }
          })
        }
      }

    })
    //获取数据库图片,轮播图
      // const db = wx.cloud.database()
      // let arry = [];
      // db.collection('pic').where({
      // //  _openid: this.data.openid
      // }).get({
      //   success: res => {
      //     //根据id 选择相应的产品.这里有两种方法，一种直接给data里面的属性赋值，另一种添加在一个数组中，最后setdata里面设置一下数组数据即可。
      //     wx.hideLoading()
      //     res.data.filter(item => {
      //       arry.push(item.src);
      //       this.setData({
      //         picss: arry
      //       });
      //     });
      //    // console.log('[数据库] [查询记录] 成功: ', res)
          
      //   },
      //   fail: err => {
      //     wx.showToast({
      //       icon: 'none',
      //       title: '查询记录失败'
      //     })
      //    // console.error('[数据库] [查询记录] 失败：', err)
      //   }
    // })
    //查询所有评论
    const db = wx.cloud.database()
    var speech=[];
    db.collection('saywords').where({
      //  _openid: this.data.openid
    }).get({
      success: res => {
        // res.data.filter(item => {
        // //  speech.unshift(item.word);
        // });
        wx.hideLoading()
        this.setData({
          words: res.data.reverse()
        });
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
      }
    })
    // 获取当前年月日
    let myDate = new Date()
    let yue = myDate.getMonth()+1;
    let year = myDate.getFullYear();
    let ri = myDate.getDate();
    this.setData({
      date: year +'/'+ yue,
      dates: year + '/' + yue+'/'+ri,
    })
  },
  // 首次获取个人信息
  onGetUserInfo: function(e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        //userInfo: e.detail.userInfo,
        userName: e.detail.userInfo.nickName,
        btn: false
      })
      console.log(e.detail.userInfo);
    }
  },

  //提交留言
  formSubmit:function(e){
    if (!this.data.says){
      wx.showToast({
        title: '兄嘚，写点啥呀',
        icon: 'none',
      })
    }else{
      const db2 = wx.cloud.database()
      db2.collection('saywords').add({
        data: { 
          word: this.data.userName,
          word1:this.data.says,
          word2: this.data.dates
        },
        success: res => {
          // 在返回结果中会包含新创建的记录的 _id
          // this.setData({
          //  // counterId: res._id,
          //   word: this.data.userName,
          //   word1: this.data.says,
          //   word2: this.data.dates
          // })
          setTimeout(()=>{
            this.setData({
              textvalue: '',
              says: ''
            })
          },800)
          
          // 刷新页面
          const pages = getCurrentPages()
          const perpage = pages[pages.length - 1]
          perpage.onLoad()

          wx.showToast({
            title: '留言成功',
          })
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '开小差了，稍后再试'
          })
         // console.error('[数据库] [新增记录] 失败：', err)
        }
      })
    }
    
  },
  sayWords: function (e) {
    this.setData({
      says: e.detail.value
    })
  },
  // 获取openid
  onGetOpenid: function () {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        wx.navigateTo({
          url: '../userConsole/userConsole',
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
     * 页面相关事件处理函数--监听用户下拉动作
     */
  onPullDownRefresh: function () {
    //console.log('我就想看看这个方法触发了没有');
    // const db = wx.cloud.database()
    // db.collection('saywords').where({
    //   //  _openid: this.data.openid
    // }).get({
    //   success: res => {
    //     // res.data.filter(item => {
          
    //     // });
    //     this.setData({
    //       words: res.data.reverse()
    //     });
    //   },
    //   fail: err => {
    //     wx.showToast({
    //       icon: 'none',
    //       title: '查询记录失败'
    //     })
    //   }
    // })
    // wx.stopPullDownRefresh();
    const pages = getCurrentPages()
    const perpage = pages[pages.length - 1]
    perpage.onLoad()
  },
  // 上传图片
  doUpload: function () {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]
        
        // 上传图片
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath
            
            wx.navigateTo({
              url: '../storageConsole/storageConsole'
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },
})
try {
  const res = wx.getSystemInfoSync()
  console.log(res.model)
  console.log(res.pixelRatio)
  console.log(res.windowWidth)
  console.log(res.windowHeight)
  console.log(res.language)
  console.log(res.version)
  console.log(res.platform)

} catch (e) {
  // Do something when catch error
}


