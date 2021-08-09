import { Scenes, Markup } from "telegraf";
import { MyContext } from "../type";
import { validateAmount } from "../utils";
//import bot from "../bot";
import {getAlipayAddressApi,createRechargeApi} from '../api'
import dayjs from 'dayjs'

interface rechargeState {
  userId?:any
  amount?:string | number
  time?:string
}

export const rechargeAlipay = new Scenes.WizardScene<MyContext>(
  "rechargeAlipay",
  async (ctx) => {
    await ctx.reply(`💵 您要充值多少钱（元）？例：200

    👇 在下面的输入框中输入金额并发送`);
    const state:rechargeState = ctx.scene.state
    state.userId = ctx.from?.id
    return ctx.wizard.next();
  },
  async (ctx) => {
    if (ctx.message && "text" in ctx.message) {
      if (!validateAmount(ctx.message.text)) {
        await ctx.reply("金额输入有误,请重新输入")
        return ctx.wizard.selectStep(1);
      } else {
        if(Number(ctx.message.text) < 100){
          await ctx.reply('人民币充值的最小金额为100元,请重新输入')
          return ctx.wizard.selectStep(1)
        }
        const state:rechargeState = ctx.scene.state
        state.amount = ctx.message.text
        state.time = dayjs().format('YYYY/MM/DD HH:mm:ss')
        const res = await getAlipayAddressApi()
        //@ts-ignore
        const address = res?.address
        await ctx.reply(`您正在使用支付宝进行充值：

充值用户：${ctx.from?.id}
充值金额：${ctx.message.text} 元
        
        
👇🏻👇🏻支付宝充值流程👇🏻👇🏻

1,点击复制账号：  ${address}
2,打开支付宝APP
3,选择支付宝账号转账
4,填入账号,填写金额并支付
5,完成后点击右下角,充值成功
         
💭温馨提醒：
本次充值支付宝账号默认视为您的TG支付提现账号，请勿使用他人账号转账！单笔充值金额大于50,000.00元时，请联系在线客服获取大额充值专用通道！`, Markup.inlineKeyboard([
          Markup.button.callback('支付完成','/confirm_alipay')
        ]));
        return ctx.wizard.next();
      }
    } else {
      return ctx.wizard.back();
    }
  },
  async (ctx) =>  {
    //@ts-ignore
    const username = ctx.chat.username || ''
    const state:rechargeState = ctx.scene.state
    await ctx.editMessageText('确认收款后,bot会为你发送确认通知')
    const res = await createRechargeApi({
      userId:state.userId,
      amount:state.amount
    })
    ctx.telegram.sendMessage(-476279416, `💳 用户充值:\nID：${state.userId}\n用户名:${username}\n充值币种：人民币\n充值金额：${state.amount}\n申请时间：${state.time}\n *请及时在后台进行审核操作后在此确认转账*`
    , {
        parse_mode:'MarkdownV2',
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "确认到账",
                callback_data: `/alipay_success:${res._id}`,
              },
              {
                text: "确认未到账",
                callback_data: `/alipay_fail:${res._id}`,
              },
            ],
          ],
        },
      });
      return ctx.scene.leave()
  }
);


export const rechargeUsdt = new Scenes.WizardScene<MyContext>(
  "rechargeUsdt",
  async (ctx) => {
    await ctx.reply(`💵 您要充值多少USDT？例：200

    👇 在下面的输入框中输入金额并发送`);
    const state:rechargeState = ctx.scene.state
    state.userId = ctx.from?.id
    return ctx.wizard.next();
  },
  async (ctx) => {
    if (ctx.message && "text" in ctx.message) {
      if (!validateAmount(ctx.message.text)) {
        await ctx.reply("金额输入有误,请重新输入")
        return ctx.wizard.selectStep(1);
      } else {
        if(Number(ctx.message.text) < 15){
          await ctx.reply('充值金额最小为15USDT,请重新输入')
          return ctx.wizard.selectStep(1);
        }
        const state:rechargeState = ctx.scene.state
        state.amount = ctx.message.text
        state.time = dayjs().format('YYYY/MM/DD HH:mm:ss')
        await ctx.reply(`💵USDT存币
TRC20存入    
TKpp76rpHkH2MvQRENxfwweFTZzmj7UEnw
       
ERC20存入
ERC20通道正在维护中 .. 请使用TRC20进行存入`, Markup.inlineKeyboard([
              Markup.button.callback('我已充值完成','/confirm_usdt')
            ]));
        return ctx.wizard.next();
      }
    } else {
      return ctx.wizard.back();
    }
  },
  async (ctx) =>  {
     //@ts-ignore
     const username = ctx.chat.username || ''
    const state:rechargeState = ctx.scene.state
    await ctx.editMessageText('确认收款后,bot会为你发送确认通知')
    const res = await createRechargeApi({
      userId:state.userId,
      amount:state.amount
    })
    ctx.telegram.sendMessage(-476279416, `💳 用户充值:\nID：${state.userId}\n用户名:${username}\n充值币种：USDT\n充值金额：${state.amount}\n申请时间：${state.time}\n *请及时在后台进行审核操作后在此确认转账*`
    , {
        parse_mode:'MarkdownV2',
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "确认到账",
                callback_data: `/usdt_success:${res._id}`,
              },
              {
                text: "确认未到账",
                callback_data: `/usdt_fail:${res._id}`,
              },
            ],
          ],
        },
      });
      return ctx.scene.leave()
  }
);