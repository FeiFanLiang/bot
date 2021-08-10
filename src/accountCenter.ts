//@ts-nocheck
import {MyContext} from './type'
import {getUserAccountApi} from './api'
import {getMarkUpButton,formatterAmount} from './utils'



export const enterUserCenterHandler = async (ctx:MyContext) => {
  const data = {
    userId:ctx.from?.id.toString()
  }
  const user = await getUserAccountApi(data)
  if(ctx.callbackQuery){
    ctx.editMessageText(`
    ➖➖➖  用户中心  ➖➖➖
  
    <b>用户账号：</b>tyusdt
    <b>我的 ID：</b> 1643888252 
        
    <b>人民币：</b><code>${formatterAmount(user.cny_balance)} （CNY）</code>
    <b>泰达币：</b><code>${formatterAmount(
      user.usdt_balance
    )} （USDT） </code>
    <b>美金：</b><code>0.00 （Usd）</code> 
    <b>比索：</b><code>0.00 （PHP） </code>
     
      <b>➖➖➖➖➖➖➖➖➖</b>`,{
      parse_mode:'HTML',
      reply_markup:{
        inline_keyboard:[
          [
            {text:'充值',callback_data:'/chongzhi'},
            {text:'转账',callback_data:'/zhuanzhang'},
            {text:'提现',callback_data:'/tx'},
            {text:'发红包',callback_data:'/fahongbao'}
          ]
        ]
      }
    })
  }else {
    ctx.reply(`  <b>➖➖➖  用户中心  ➖➖➖</b>
   
  <b>人民币：</b><code>${formatterAmount(user.cny_balance)} 元（CNY）</code>
  <b>虚拟币：</b><code>${formatterAmount(user.usdt_balance)} 枚（USDT）</code> 
  <b>我的 ID：</b><code> ${user.userId}</code> 
  <b>用户账号：</b><code>${user.accountName}</code>
  
  <b>➖➖➖➖➖➖➖➖➖</b>
  <i>🗣提示：使用户名就可以转账给好友哦 ~</i>`,{
    parse_mode:'HTML',
    reply_markup:{
      inline_keyboard:[
        [
          {text:'充值',callback_data:'/chongzhi'},
          {text:'转账',callback_data:'/zhuanzhang'},
          {text:'提现',callback_data:'/tx'},
          {text:'发红包',callback_data:'/fahongbao'}
        ]
      ]
    }
  })
  }
  
}
