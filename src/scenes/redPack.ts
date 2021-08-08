import { Scenes, Markup, Composer } from "telegraf";
import { MyContext } from "../type";
import { validateAmount } from "../utils";
import {createRedPackApi} from '../api'

const redPackStageHandler = new Composer<MyContext>();
redPackStageHandler.action("/cancel", async (ctx) => {
  ctx.reply('红包取消创建')
  return ctx.scene.leave()
});

interface redPackState {
  amount?:number
  number?:number
}

export const redPack = new Scenes.WizardScene<MyContext>(
  "redPack",
  async (ctx) => {
    await ctx.reply("请输入红包金额");
    return ctx.wizard.next();
  },
  redPackStageHandler,
  async (ctx) => {
    //@ts-ignore
    if(!validateAmount(ctx.message.text)){
      await ctx.reply('红包金额输入有误，请重新输入')
      return ctx.wizard.selectStep(1)
    }else {
      //@ts-ignore
      if(Number(ctx.message.text) < 10){
        await ctx.reply('红包总金额最小为10元')
        return ctx.wizard.selectStep(1)
      }
      //@ts-ignore
      (ctx.scene.state as redPackState).amount = Number(ctx.message.text)
      await ctx.reply("请输入红包个数",{
        reply_markup:{
          inline_keyboard:[
            [
              {text:'取消',callback_data:'/cancel'}
            ]
          ]
        }
      });
      return ctx.wizard.next();
    }
  },
  async (ctx) => {
    if (ctx.message && "text" in ctx.message) {
      const text = ctx.message.text;
      if (/^[1-9]\d*$/.test(text)) {
        //创建红包
        const state:redPackState = ctx.scene.state;
        if(state.amount as number / Number(text) < 1){
          await ctx.reply('单个红包最小金额不能低于1元,请重新输入红包个数')
          return ctx.wizard.selectStep(2)
        }
        const url ='https://telegra.ph/file/58b2550c7a12120ab1c5b.jpg'
        //@ts-ignore
        const userName = ctx.chat.username || ''
        const redPackUid = await createRedPackApi({
          userId:ctx.from?.id,
          username:userName,
          amount:state.amount,
          number:Number(text)
        })
        if(!redPackUid){
          await ctx.reply('创建红包失败，您的余额不足')
        }else {
          await ctx.replyWithPhoto(
            url,
            {
              reply_markup: Markup.inlineKeyboard([
                Markup.button.url(
                  "抢红包",
                  `https://t.me/Long_pay_bot?start=${redPackUid}`
                ),
              ]).reply_markup,
              caption:'点击领取您的好友创建的红包'
            },
          );
        }
        return ctx.scene.leave()
        
      } else {
        await ctx.reply("金额输入错误");
        return ctx.wizard.selectStep(2);
      }
    }
  }
);
