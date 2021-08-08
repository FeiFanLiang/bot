import {MyContext} from './type'
import {Markup} from 'telegraf'
import bot from './bot'
//@ts-ignore
import {getTemplateApi,getAlipayAddressApi,getUserAccountApi,checkUserUsdtApi,checkUsdtRechargeApi} from './api'
import dayjs from 'dayjs'

export const confirmAlipayHandler = (ctx:MyContext) => {
  bot.telegram.sendMessage(-476279416, `💳 用户充值:\nID：${ctx.from?.id}\n用户：${ctx.from?.first_name}${ctx.from?.last_name}\n充值币种：人民币\n申请时间：${dayjs().format('YYYY/MM/DD HH:mm:ss')}`
, {
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


export const confirmUsdtHandler = async (ctx:MyContext) => {
  const time = dayjs().format('YYYY/MM/DD HH:mm:ss')
  setTimeout(async () => {
    checkUsdtRechargeApi({
      userId:ctx.from?.id
    }).then((res:number) => {
      if(res){
        ctx.telegram.sendMessage((ctx.from?.id) as number,`您的USDT充值${res}已到账`)
        bot.telegram.sendMessage(-476279416, `💳 查询到用户充值到账\n用户充值:\nID：${ctx.from?.id}\n用户：${ctx.from?.first_name}${ctx.from?.last_name}\n充值币种：USDT\n金额：${res}\n申请时间：${time}\n请确认到账金额是否正确`);
      }else {
        ctx.telegram.sendMessage((ctx.from?.id) as number,`您的USDT充值${res}未查询到账`)
        bot.telegram.sendMessage(-476279416, `💳 未查询到用户充值到账\n用户充值:\nID：${ctx.from?.id}\n用户：${ctx.from?.first_name}${ctx.from?.last_name}\n充值币种：USDT\n金额：${res}\n申请时间：${time}\n请人工核查`);
      }
    })
  }, 30000);
  ctx.editMessageText('请等待确认到账')
  bot.telegram.sendMessage(-476279416, `💳 用户充值:\nID：${ctx.from?.id}\n用户：${ctx.from?.first_name}${ctx.from?.last_name}\n充值币种：USDT\n申请时间：${time}\nUSDT到账方式为自动到账`);
}

export const alipayAddressHandler = (ctx:MyContext) => {
  ctx.scene.enter('rechargeAlipay')
}

export const usdtAddressHandler = async (ctx:MyContext) => {
  ctx.scene.enter('rechargeUsdt')
//   ctx.reply(`💵USDT存币
// TRC20存入  
// TKpp76rpHkH2MvQRENxfwweFTZzmj7UEnw
// ERC20存入
// ERC20通道正在维护中 .. 请使用TRC20进行存入
// 提示：
// \- 对上述地址👆充值后，经过网络确认，充值成功！
// \- 请耐心等待，充值成功后 Bot 会通知您！
// \- 如果等待仍未到账，请联系客服处理`, Markup.inlineKeyboard([
//       Markup.button.callback('我已充值完成','/confirm_usdt')
//     ]));
//   const address = await checkUserUsdtApi({
//     userId:ctx.from?.id
//   })
//   if(!address){
//     ctx.reply('USDT转账维护中，请稍后再试')
//   }else {
//     ctx.reply(`💵USDT存币
// TRC20存入  
// TKpp76rpHkH2MvQRENxfwweFTZzmj7UEnw
// ERC20存入
// ERC20通道正在维护中 .. 请使用TRC20进行存入
// 提示：
// \- 对上述地址👆充值后，经过网络确认，充值成功！
// \- 请耐心等待，充值成功后 Bot 会通知您！
// \- 如果等待仍未到账，请联系客服处理`, Markup.inlineKeyboard([
//       Markup.button.callback('我已充值完成','/confirm_usdt')
//     ]));
//   }
}

export const initRechargeHandler = async (ctx:MyContext) => {
  // const template = await getTemplateApi({
  //   key:'recharge'
  // })
  //@ts-ignore
  //const text = template.context
  ctx.reply(`👇 请从下面选择一个充值方式👇`,Markup.inlineKeyboard([
    Markup.button.callback('🏧支付宝代充','/alipay'),
    Markup.button.callback('💵USDT充值','/usdt')
  ]))
}





