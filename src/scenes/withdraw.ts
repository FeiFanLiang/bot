import { Scenes, Markup } from "telegraf";
import { MyContext } from "../type";
import { validateAmount, formatterAmount } from "../utils";
import bot from "../bot";
import { getUserAccountApi, addAddressApi, getUserAmountApi } from "../api";
import dayjs from "dayjs";

interface withdrawState {
  account?: string;
  amount?: number;
  user?: any;
}

export const withdrawAlipay = new Scenes.WizardScene<MyContext>(
  "withdrawAlipay",
  async (ctx) => {
    const user: any = await getUserAccountApi({
      userId: ctx.from?.id.toString(),
    });
    //@ts-ignore
    ctx.scene.state.user = user;
    if (user.cny_accounts.length) {
      await ctx.reply("请选择要提现的账号", {
        reply_markup: {
          inline_keyboard: user.cny_accounts.map((account: string) => [
            {
              text: account,
              callback_data: account,
            },
          ]),
        },
      });
    } else {
      await ctx.reply(
        "👆您还没有添加提现账号,请先添加提现账号后再进行提现操作"
      );
      return ctx.scene.leave();
    }

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
      const user = state.user;
      if (!validateAmount(ctx.message.text)) {
        await ctx.reply("金额输入有误,请重新输入");
        return ctx.wizard.selectStep(2);
      } else {
        const amount = Number(ctx.message.text);
        if (amount < 100) {
          await ctx.reply("提现最小金额人民币为100元,请重新输入");
          return ctx.wizard.selectStep(2);
        }
        if (user.cny_balance - amount < 0) {
          await ctx.reply("您的余额不足", {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: "个人中心",
                    callback_data: "/my",
                  },
                ],
              ],
            },
          });
        } else {
          await ctx.reply(
            "您的提现请求已提交审核，审核完毕后bot推送给您审核结果"
          );
          //提现相关逻辑
          bot.telegram.sendMessage(
            -1001592957188,
            `💳 提现申请：
用户ID： ${user.userId}
用户：@${user.accountName}
提现币种：人民币
提现金额：${ctx.message.text} 
用户余额: ${formatterAmount(user.cny_balance)}
提现账户：${state.account}
申请时间：${dayjs().format("YYYY/MM/DD HH:mm:ss")}

操作提示：
审核无误后点击 “提现审核通过”，有疑问的订单点 “ 提现失败 ”并说明失败理由。
财务操作过转账后点击该账单上的 “已转出”按钮`,
            Markup.inlineKeyboard([
              Markup.button.callback(
                "提现成功",
                `withdraw_success:${user.userId}`
              ),
              Markup.button.callback(
                "提现失败",
                `withdraw_fail:${user.userId}`
              ),
            ])
          );
        }
        return ctx.scene.leave();
      }
    } else {
      return ctx.wizard.back();
    }
  }
);

export const withdrawUsdt = new Scenes.WizardScene<MyContext>(
  "withdrawUsdt",
  async (ctx) => {
    const user: any = await getUserAccountApi({
      userId: ctx.from?.id.toString(),
    });
    //@ts-ignore
    ctx.scene.state.user = user;
    if (user.usdt_address.length) {
      await ctx.reply("请选择要提现的地址", {
        reply_markup: {
          inline_keyboard: user.usdt_address.map((account: string) => [
            {
              text: account,
              callback_data: account,
            },
          ]),
        },
      });
    } else {
      await ctx.reply(
        "👆您还没有添加提现地址,请先添加提现地址后再进行提现操作"
      );
      return ctx.scene.leave();
    }

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
      const user = state.user;
      if (!validateAmount(ctx.message.text)) {
        await ctx.reply("金额输入有误,请重新输入");
        return ctx.wizard.selectStep(2);
      } else {
        const amount = Number(ctx.message.text);
        if (amount < 15) {
          await ctx.reply("提现最小金额USDT为15个,请重新输入");
          return ctx.wizard.selectStep(2);
        }
        if (user.usdt_balance - amount < 0) {
          await ctx.reply("您的余额不足", {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: "个人中心",
                    callback_data: "/my",
                  },
                ],
              ],
            },
          });
        } else {
          await ctx.reply(
            "您的提现请求已提交审核，审核完毕后bot推送给您审核结果"
          );
          //提现相关逻辑
          bot.telegram.sendMessage(
            -1001592957188,
            `💳 提现申请：
用户ID：${user.userId}
用户：@${user.accountName}
提现币种：USDT
提现金额：${ctx.message.text} 
用户余额: ${formatterAmount(user.usdt_balance)}
提现账户：${state.account}
申请时间：${dayjs().format("YYYY/MM/DD HH:mm:ss")}
         
操作提示：
审核无误后点击 “提现审核通过”，有疑问的订单点 “ 提现失败 ”并说明失败理由。
财务操作过转账后点击该账单上的 “已转出”按钮`,
            Markup.inlineKeyboard([
              Markup.button.callback(
                "提现成功",
                `withdraw_success:${user.userId}`
              ),
              Markup.button.callback(
                "提现失败",
                `withdraw_fail:${user.userId}`
              ),
            ])
          );
        }

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
    //@ts-ignore
    const text = ctx?.message?.text?.trim();
    await addAddressApi({
      userId: ctx.from?.id.toString(),
      address: text,
      type: "CNY",
    });
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
    //@ts-ignore
    const text = ctx?.message?.text?.trim();
    await addAddressApi({
      userId: ctx.from?.id.toString(),
      address: text,
      type: "USDT",
    });
    await ctx.reply("添加地址成功");
    return ctx.scene.leave();
  }
);
