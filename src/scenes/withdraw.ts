import { Scenes, Markup } from "telegraf";
import { MyContext } from "../type";
import { validateAmount } from "../utils";
import bot from "../bot";

interface withdrawState {
  account?: string;
  amount?: number;
}

export const withdrawAlipay = new Scenes.WizardScene<MyContext>(
  "withdrawAlipay",
  async (ctx) => {
    await ctx.reply("请选择要提现的账号", {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "账号1",
              callback_data: "account1",
            },
          ],
          [
            {
              text: "账号2",
              callback_data: "account2",
            },
          ],
          [
            {
              text: "账号3",
              callback_data: "account3",
            },
          ],
          [
            {
              text: "账号4",
              callback_data: "account4",
            },
          ],
        ],
      },
    });
    return ctx.wizard.next();
  },
  async (ctx) => {
    await ctx.reply("请输入提现金额");
    if (ctx.callbackQuery && "data" in ctx.callbackQuery) {
      const state: withdrawState = ctx.scene.state;
      state.account = ctx.callbackQuery.data;
    }
    return ctx.wizard.next();
  },
  async (ctx) => {
    if (ctx.message && "text" in ctx.message) {
      const state: withdrawState = ctx.scene.state;
      if (!validateAmount(ctx.message.text)) {
        await ctx.reply("金额输入有误,请重新输入");
        return ctx.wizard.selectStep(2);
      } else {
        console.log(state);
        //提现相关逻辑
        bot.telegram.sendMessage(
          -476279416,
          "用户提现申请",
          Markup.inlineKeyboard([
            Markup.button.callback(
              "提现成功",
              `withdraw_success:${ctx.from?.id}`
            ),
            Markup.button.callback("提现失败", `withdraw_fail:${ctx.from?.id}`),
          ])
        );
        await ctx.reply("提现成功");
        return ctx.scene.leave();
      }
    } else {
      return ctx.wizard.back();
    }
  }
);

export const addAlipayAccount = new Scenes.WizardScene<MyContext>(
  "addAlipayAccount",
  async (ctx) => {
    await ctx.reply("请输入要添加支付宝账号");
    return ctx.wizard.next();
  },
  async (ctx) => {
    //添加账号
    await ctx.reply("添加账号成功");
    return ctx.scene.leave();
  }
);

export const addUsdtAddress = new Scenes.WizardScene<MyContext>(
  "addUsdtAddress",
  async (ctx) => {
    await ctx.reply("请输入要添加的提币地址");
    return ctx.wizard.next();
  },
  async (ctx) => {
    await ctx.reply("添加地址成功");
    return ctx.scene.leave();
  }
);
