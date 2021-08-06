import {MyContext} from './type'
import {Markup} from 'telegraf'
import bot from './bot'


export const confirmAlipayHandler = (ctx:MyContext) => {
  bot.telegram.sendMessage(-476279416, "用户充值", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "确认到账",
            callback_data: `/alipay_success:${ctx.from?.id}`,
          },
          {
            text: "确认未到账",
            callback_data: `/alipay_fail:${ctx.from?.id}`,
          },
        ],
      ],
    },
  });
}


export const confirmUsdtHandler = (ctx:MyContext) => {
  bot.telegram.sendMessage(-476279416, "usdt充值", {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "确认到账", callback_data: `/usdt_success:${ctx.from?.id}` },
          {
            text: "确认未到账",
            callback_data: `/usdt_fail:${ctx.from?.id}`,
          },
        ],
      ],
    },
  });
}

export const alipayAddressHandler = (ctx:MyContext) => {
  ctx.reply("支付邮箱xxxxxxx.com,请付款", Markup.inlineKeyboard([
    Markup.button.callback('支付完成','/confirm_alipay')
  ]));
}

export const usdtAddressHandler = (ctx:MyContext) => {
  ctx.reply("充值地址xxxxxxx,请充值", Markup.inlineKeyboard([
    Markup.button.callback('充值完成','/confirm_usdt')
  ]));
}

export const initRechargeHandler = (ctx:MyContext) => {
  ctx.reply("选择充值渠道",Markup.inlineKeyboard([
    Markup.button.callback('支付宝','/alipay'),
    Markup.button.callback('USDT-TRC20','/usdt')
  ]))
}





