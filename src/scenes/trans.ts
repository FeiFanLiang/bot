import { Scenes, Markup, Composer } from "telegraf";
import { MyContext } from "../type";
import { validateAmount } from "../utils";
import {transApi} from '../api'

interface transState {
  username?: string;
  amount?: string;
  type?: "CNY" | "USDT";
}

const stepHandler = new Composer<MyContext>();
stepHandler.action("confirm_trans", async (ctx) => {
  //转账
  const state:transState = ctx.scene.state;
  const data = {
    from:ctx.from?.id,
    to:state.username,
    amount:state.amount,
    type:state.type
  }
  try {
    const res = await transApi(data)
  if(res === 0){
    await ctx.editMessageText('未找到用户')
  }
  if(res === 1){
    await ctx.editMessageText('您的余额不足')
  }
  if(res === 2){
    await ctx.editMessageText('网络异常')
  }
  if(res === 3){
    await ctx.editMessageText(`向${state.username}的${state.amount}转账成功`)
  }
  } catch (e) {
    await ctx.editMessageText('网络异常')
  }
  
  return ctx.scene.leave();
});

stepHandler.action("cancel_trans", async (ctx) => {
  //取消
  await ctx.editMessageText("您已取消转账");
  return ctx.scene.leave();
});

export const transScene = new Scenes.WizardScene(
  "trans",
  async (ctx) => {
    await ctx.reply(`💵 您要转账的金额  ？例：8.88

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
        state.amount = ctx.message.text;
        await ctx.reply(`请输入转账的用户名
        例如：zhangsan`);
        return ctx.wizard.next();
      }
    } else {
      return ctx.wizard.back();
    }
  },
  async (ctx) => {
    if(ctx.message && 'text' in ctx.message){
      const state = ctx.scene.state as transState;
    state.username = ctx.message.text.trim()
    await ctx.reply(
      `确认转账信息\n转账用户${state.username}\n转账金额${state.amount}\n转账类型:*${
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
