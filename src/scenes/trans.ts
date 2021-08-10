import { Scenes, Markup, Composer } from "telegraf";
import { MyContext } from "../type";
import { validateAmount } from "../utils";
import {transApi,getUserAmountApi} from '../api'

interface transState {
  username?: string;
  userId?:string;
  amount?: number;
  type?: "CNY" | "USDT";
}

const stepHandler = new Composer<MyContext>();
stepHandler.action("confirm_trans", async (ctx) => {
  //转账
  const state:transState = ctx.scene.state;
  const data = {
    from:ctx.from?.id,
    toUserId:state.userId,
    toUserName:state.username,
    amount:state.amount,
    type:state.type
  }
  try {
    const res = await transApi(data)
  if(res === 0){
    await ctx.editMessageText('未找到用户')
  }
  if(res === 1){
    await ctx.editMessageText('您的余额不足',{
      reply_markup:{
        inline_keyboard:[
          [
            {
              text:'个人中心',
              callback_data:'/my'
            }
          ]
        ]
      }
    })
  }
  if(res === 2){
    await ctx.editMessageText('网络异常')
  }
  if(res === 3){
    await ctx.editMessageText(`您的转账成功,转账金额为${state.amount}`,{
      reply_markup:{
        inline_keyboard:[
          [
            {
              text:'个人中心',
              callback_data:'/my'
            }
          ]
        ]
      }
    })
  }
  } catch (e) {
    await ctx.editMessageText('网络异常')
  }
  
  return ctx.scene.leave();
});

stepHandler.action("cancel_trans", async (ctx) => {
  //取消
  await ctx.editMessageText("您已取消转账",{
    reply_markup:{
      inline_keyboard:[
        [
          {
            text:'个人中心',
            callback_data:'/my'
          }
        ]
      ]
    }
  });
  return ctx.scene.leave();
});

export const transScene = new Scenes.WizardScene(
  "trans",
  async (ctx) => {
    await ctx.reply(`💵 您要转账的金额  ？例：100

👇 在下面的输入框中输入金额并发送。`);
    return ctx.wizard.next();
  },
  async (ctx) => {
    if (ctx.message && "text" in ctx.message) {
      if (!validateAmount(ctx.message.text)) {
        await ctx.reply("输入金额有误,请重新输入");
        return ctx.wizard.selectStep(1);
      } else {
        const state = ctx.scene.state as transState;
        if(state.type === "CNY" && Number(ctx.message.text) < 100){
          await ctx.reply('转账最小为100元,请重新输入')
          return ctx.wizard.selectStep(1)
        }
        if(state.type === 'USDT' && Number(ctx.message.text) < 15){
          await ctx.reply('转账最小USDT为15个,请重新输入')
          return ctx.wizard.selectStep(1)
        }
        const userId = ctx.from?.id.toString()
        const userAmount = await getUserAmountApi({
          userId:userId
        })
        state.amount = Number(ctx.message.text);
        //@ts-ignore
        const hasAmount = state.type === 'CNY' ? (userAmount.cny_balance - state.amount > 0) : (userAmount.usdt_balance - state?.amount > 0)
        if(hasAmount){
          await ctx.reply(`请输入转账的用户名或用户ID
          例如：@zhangsan或12313122`);
          return ctx.wizard.next();
        }else {
          await ctx.reply(`您的账户余额不足，请充值后再继续操作!`,{
            reply_markup:Markup.inlineKeyboard([
              Markup.button.callback('个人中心','/my')
            ]).reply_markup
          })
          return ctx.scene.leave()
        }
        
      }
    } else {
      return ctx.wizard.back();
    }
  },
  async (ctx) => {
    
    if(ctx.message && 'text' in ctx.message){
      const state = ctx.scene.state as transState;
      const text = ctx.message.text.trim()
      if(!/@\S+/.test(text) && !/\d+/.test(text)){
        await ctx.reply('您的输入有误，请输入正确的用户名或者用户ID')
        return ctx.wizard.selectStep(2)
      }
      if(/@\S+/.test(text)){
        state.username = text.replace(/@(\S+)/,'$1')
      }else {
        state.userId = text.replace(/(\d+)/,'$1')
      }
      await ctx.reply(
        `确认转账信息\n转账用户：${state.username ? state.username : state.userId}\n转账金额：${state.amount}\n转账类型：*${
          state.type === "CNY" ? "人民币" : "USDT"
        }*`,
        {
          parse_mode: "MarkdownV2",
          reply_markup: Markup.inlineKeyboard([
            Markup.button.callback("确认转账", "confirm_trans"),
            Markup.button.callback("取消", "cancel_trans"),
          ]).reply_markup,
        }
      );
      return ctx.wizard.next();
    }
    return ctx.wizard.selectStep(1)
  },
  stepHandler
);
