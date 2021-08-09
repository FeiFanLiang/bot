import bot from "./bot";
import { Markup } from "telegraf";
import {
  initRechargeHandler,
  alipayAddressHandler,
  usdtAddressHandler,
  confirmAlipayHandler,
  confirmUsdtHandler,
} from "./recharge";
import { transStartHandler, transHandler } from "./trans";
import { withdrawStartHandler } from "./withdraw";
import { enterUserCenterHandler } from "./accountCenter";
import {
  checkUserApi,
  getUserAccountApi,
  updateRechargeApi,
  getRedPackApi,
  checkIsSelfPackApi,
} from "./api";
import { formatterAmount } from "./utils";
import dayjs from "dayjs";

bot.command("start", async (ctx) => {
  const userId = ctx.message.from.id;
  //@ts-ignore
  const userName = ctx.chat.username || "";
  const data = {
    accountName: userName,
    userId,
  };
  await checkUserApi(data);
  const redPackUid = ctx.message.text.replace(/\/start\s*(\S*)/, "$1");

  const user: any = await getUserAccountApi({
    userId,
  });

  ctx.reply(
    `  <b>➖➖➖  用户中心  ➖➖➖</b>
     
    <b>人民币：</b><code>${formatterAmount(user.cny_balance)} 元（CNY）</code>
    <b>虚拟币：</b><code>${formatterAmount(
      user.usdt_balance
    )} 枚（USDT）</code> 
    <b>我的 ID：</b><code> ${user.userId}</code> 
    <b>用户账号：</b><code>${user.accountName}</code>
    
    <b>➖➖➖➖➖➖➖➖➖</b>
    <i>🗣提示：使用户名就可以转账给好友哦 ~</i>`,
    {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [
            { text: "充值", callback_data: "/chongzhi" },
            { text: "转账", callback_data: "/zhuanzhang" },
            { text: "提现", callback_data: "/tx" },
            { text: "发红包", callback_data: "/fahongbao" },
          ],
        ],
      },
    }
  );
  if (redPackUid) {
    const isSelf = await checkIsSelfPackApi({ id: redPackUid, userId: userId });
    if (!isSelf) {
      const url = "https://telegra.ph/file/58b2550c7a12120ab1c5b.jpg";
      ctx.replyWithPhoto(url, {
        reply_markup: Markup.inlineKeyboard([
          Markup.button.callback("抢红包", `/getPack:${redPackUid}`),
        ]).reply_markup,
        caption: "点击抢红包试试手气吧",
      });
    }
  }
});

/**
 * 个人中心
 */

bot.command("my", enterUserCenterHandler);
bot.action("/my", enterUserCenterHandler);

/**
 * 充值
 */
bot.command("chongzhi", initRechargeHandler);
bot.action("/chongzhi", initRechargeHandler);
//alipay
bot.action("/alipay", alipayAddressHandler);
bot.command("alipay", alipayAddressHandler);
//usdt
bot.command("usdt", usdtAddressHandler);
bot.action("/usdt", usdtAddressHandler);

bot.action("/confirm_usdt", confirmUsdtHandler);
bot.action("/confirm_alipay", confirmAlipayHandler);

bot.action(/\/alipay_fail\:\S+/, async (ctx) => {
  if (ctx.callbackQuery && "data" in ctx.callbackQuery) {
    const orderId = ctx.callbackQuery?.data.replace(
      /\/alipay_fail\:(\S+)/,
      "$1"
    );
    const recharge = await updateRechargeApi({
      id: orderId,
      success: false,
    });
    //@ts-ignore
    const confirmUser = ctx.from.username;
    ctx.editMessageText(
      `*用户充值确认未到账*\n\n*充值用户：*${recharge.userId}\n\n*充值金额：*${
        recharge.amount
      }\n\n*创建时间:* ${dayjs(recharge.createTime).format(
        "YYYY/MM/DD HH:mm:ss"
      )}\n\n*客服操作人:* ${confirmUser}`,
      {
        parse_mode: "MarkdownV2",
      }
    );
    ctx.telegram.sendMessage(
      recharge.userId,
      `您的支付宝充值金额${recharge.amount}到账失败,如果您有疑问请联系客服咨询`
    );
  }
});
bot.action(/\/alipay_success\:\S+/, async (ctx) => {
  if (ctx.callbackQuery && "data" in ctx.callbackQuery) {
    const orderId = ctx.callbackQuery?.data.replace(
      /\/alipay_success\:(\S+)/,
      "$1"
    );
    const recharge = await updateRechargeApi({
      id: orderId,
      success: true,
    });
    const account: any = await getUserAccountApi({
      userId: recharge.userId,
    });
    //@ts-ignore
    const confirmUser = ctx.from.username;
    ctx.editMessageText(
      `*用户充值确认到账*\n\n*充值用户：*${recharge.userId}\n\n*充值金额：*${
        recharge.amount
      } \n\n*账户余额：*${formatterAmount(account.cny_balance).replace(
        ".",
        "\\."
      )}\n\n*创建时间：* ${dayjs(recharge.createTime).format(
        "YYYY/MM/DD HH:mm:ss"
      )}\n\n*客服操作人：* ${confirmUser}`,
      {
        parse_mode: "MarkdownV2",
      }
    );
    ctx.telegram.sendMessage(
      recharge.userId,
      `您的支付宝充值已确认到账,当前账户余额为${formatterAmount(
        account.cny_balance
      )}`
    );
  }
});

bot.action(/\/usdt_fail\:\S+/, async (ctx) => {
  if (ctx.callbackQuery && "data" in ctx.callbackQuery) {
    const orderId = ctx.callbackQuery?.data.replace(/\/usdt_fail\:(\S+)/, "$1");
    const recharge = await updateRechargeApi({
      id: orderId,
      success: false,
    });
    ctx.editMessageText("已确认充值失败");
    ctx.telegram.sendMessage(
      recharge.userId,
      `您的USDT充值金额${recharge.amount}到账失败,如果您有疑问请联系客服咨询`
    );
  }
});
bot.action(/\/usdt_success\:\S+/, async (ctx) => {
  if (ctx.callbackQuery && "data" in ctx.callbackQuery) {
    const orderId = ctx.callbackQuery?.data.replace(
      /\/usdt_success\:(\S+)/,
      "$1"
    );
    const recharge = await updateRechargeApi({
      id: orderId,
      success: true,
    });
    const account: any = await getUserAccountApi({
      userId: recharge.userId,
    });
    ctx.editMessageText(
      `bot会发送消息提醒用户成功,用户${recharge.userId}本次充值${
        recharge.amount
      },账户余额剩余${formatterAmount(account.usdt_balance)}`
    );
    ctx.telegram.sendMessage(
      recharge.userId,
      `您的USDT充值已确认到账,当前账户余额为${formatterAmount(
        account.usdt_balance
      )}`,
      {
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
      }
    );
  }
});
/**
 * 转账
 */

bot.command("zhuanzhang", transStartHandler);
bot.action("/zhuanzhang", transStartHandler);
//转账操作开始
bot.command(["rmb_zz", "usdt_zz"], transHandler);
bot.action(["/rmb_zz", "/usdt_zz"], transHandler);

/**
 * 提现
 */
bot.command("tx", withdrawStartHandler);
bot.action("/tx", withdrawStartHandler);

bot.action(/withdraw_success:(\d)+/, (ctx) => {
  //@ts-ignore
  const userId = ctx.callbackQuery?.data.replace(
    /withdraw_success\:(\d+)/,
    "$1"
  );
  ctx.telegram.sendMessage(userId, "您的提现请求已审核通过", {
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
});

bot.action(/withdraw_fail:(\d)+/, (ctx) => {
  //@ts-ignore
  const userId = ctx.callbackQuery?.data.replace(/withdraw_fail\:(\d+)/, "$1");
  ctx.telegram.sendMessage(userId, "您的提现请求审核未通过", {
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
});

bot.action("/add_alipay_account", (ctx) => {
  ctx.scene.enter("addAlipayAccount");
});
bot.command("add_alipay_account", (ctx) => {
  ctx.scene.enter("addAlipayAccount");
});
bot.action("/add_usdt_address", (ctx) => {
  ctx.scene.enter("addUsdtAddress");
});
bot.command("add_usdt_address", (ctx) => {
  ctx.scene.enter("addUsdtAddress");
});
bot.action("/usdt_tx", (ctx) => {
  ctx.scene.enter("withdrawUsdt");
});
bot.action("/cny_tx", (ctx) => {
  ctx.scene.enter("withdrawAlipay");
});
bot.command("cny_tx", (ctx) => {
  ctx.scene.enter("withdrawAlipay");
});
bot.command("usdt_tx", (ctx) => {
  ctx.scene.enter("withdrawUsdt");
});

/**
 * 红包
 */

bot.action("/fahongbao", (ctx) => {
  ctx.scene.enter("redPack");
});
bot.command("fahongbao", (ctx) => {
  ctx.scene.enter("redPack");
});
bot.action(/\/getPack:\S+/, async (ctx) => {
  //@ts-ignore
  const redPackUid = ctx.callbackQuery?.data.replace(/\/getPack:(\S+)/, "$1");
  if (redPackUid) {
    const res = await getRedPackApi({
      id: redPackUid,
      userId: ctx.from?.id,
    });
    await ctx.editMessageReplyMarkup(undefined);
    if (res) {
      await ctx.reply(
        `恭喜您已经成功领取由您好友${
          res.createUserName
        }发放的红包，金额为人民币${formatterAmount(res.amount)},已存入您的钱包`,
        {
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
        }
      );
    } else {
      await ctx.reply("来晚了哦，红包已经被抢光了");
    }
  }
});
