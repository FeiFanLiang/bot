import { Scenes, Markup, Composer } from "telegraf";
import { MyContext } from "../type";
interface transState {
  username?: string;
  amount?: number;
  type: "CNY" | "USDT";
}

const stepHandler = new Composer<MyContext>();
stepHandler.action("confirm_trans", async (ctx) => {
  //转账
  await ctx.reply("转账成功");
  return ctx.scene.leave();
});

stepHandler.action("cancel_trans", async (ctx) => {
  //取消
  await ctx.reply("取消转账");
  return ctx.scene.leave();
});

export const transScene = new Scenes.WizardScene(
  "trans",
  async (ctx) => {
    const state = ctx.scene.state as transState;
    await ctx.reply(
      `确认转账信息,向${state.username}转账${state.amount}`,
      Markup.inlineKeyboard([
        Markup.button.callback("确认转账", "confirm_trans"),
        Markup.button.callback("取消", "cancel_trans"),
      ])
    );
    return ctx.wizard.next();
  },
  stepHandler
);
