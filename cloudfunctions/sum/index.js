// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
// // 云函数入口函数
// exports.main = async (event, context) => {
//   const wxContext = cloud.getWXContext()

//   return {
//     event,
//     openid: wxContext.OPENID,
//     appid: wxContext.APPID,
//     unionid: wxContext.UNIONID,
//   }
// }
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await db.collection('shoppingMall').doc(event._id).update({
      // data 传入需要局部更新的数据
      data: {
        count: event.count
      }
    })
  } catch (e) {
    console.error(e)
  }
}