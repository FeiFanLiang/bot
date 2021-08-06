import {MyContext} from './type'

export const withdrawStartHandler = (ctx:MyContext) => {
  ctx.reply('提现操作',{
    reply_markup:{
      inline_keyboard:[
        [
          {
            text:"支付宝提现",
            callback_data:'/cny_tx'
          },
          {
            text:'USDT提币',
            callback_data:'/usdt_tx'
          }
        ],
        [
          {
            text:'添加支付宝账号',
            callback_data:'/add_alipay_account'
          },
          {
            text:'添加usdt地址',
            callback_data:'/add_usdt_address'
          }
        ]
      ]
    }
  })
}