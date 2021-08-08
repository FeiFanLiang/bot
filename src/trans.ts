import {MyContext} from './type'


export const transStartHandler = (ctx:MyContext) => {
  ctx.reply('请选择转账币种',{
    reply_markup:{
      inline_keyboard:[
        [
          {
            text:'人民币',
            callback_data:'/rmb_zz'
          },
          {
            text:"USDT",
            callback_data:'/usdt_zz'
          }
        ],
        [
          {
            text:"个人中心",
            callback_data:'/my'
          }
        ]
      ]
    }
  })
}

export const transHandler = (ctx:MyContext) => {
  //@ts-ignore
  const isCNY = ctx?.callbackQuery?.data ? ctx?.callbackQuery?.data?.startsWith('/rmb_zz') ? 'CNY' : 'USDT' : ctx?.message?.text?.startsWith('/rmb_zz') ? 'CNY' : 'USDT'
  ctx.scene.enter('trans',{
    type:isCNY
  })
}


