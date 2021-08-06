import { Scenes, Markup, Composer } from "telegraf";
import { MyContext } from "../type";
import { validateAmount } from "../utils";

const redPackStageHandler = new Composer<MyContext>();
redPackStageHandler.action("create_red_pack", async (ctx) => {
  await ctx.reply("请输入红包总金额");
  return ctx.wizard.next();
});

export const redPack = new Scenes.WizardScene<MyContext>(
  "redPack",
  async (ctx) => {
    await ctx.reply("请输入红包金额");
    return ctx.wizard.next();
  },
  async (ctx) => {
    await ctx.reply("请输入红包个数");
    if (ctx.message && "text" in ctx.message) {
    }
    return ctx.wizard.next();
  },
  async (ctx) => {
    if (ctx.message && "text" in ctx.message) {
      const text = ctx.message.text;
      if (validateAmount(text)) {
        //创建红包
        await ctx.reply("转发红包即可进行领取");
        await ctx.replyWithPhoto(
          "https://images.669pic.com/element_min_new_pic/23/78/34/54/3b6214ba344d81e14d01d5ec53f630b1.png",
          Markup.inlineKeyboard([
            Markup.button.url(
              "抢红包",
              "https://t.me/Long_pay_bot?start=vCH1vGWJxfSeofSAs0K5PA"
            ),
          ])
        );
        return ctx.scene.leave();
      } else {
        await ctx.reply("金额输入错误");
        return ctx.wizard.selectStep(2);
      }
    }
  }
);
