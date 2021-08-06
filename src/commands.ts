import bot from "./bot";
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

bot.command("start", async (ctx) => {
  const redPackUid = ctx.message.text.replace(/\/start\s*(\S*)/, "$1");
  if (redPackUid) {
    await ctx.reply("领取红包成功");
  }
  ctx.reply("欢迎首页", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "充值",
            callback_data: "/chongzhi",
          },
          {
            text: "转账",
            callback_data: "/zhuanzhang",
          },
          {
            text: "提现",
            callback_data: "/tx",
          },
          {
            text: "红包",
            callback_data: "/fahongbao",
          },
        ],
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

bot.action(/\/alipay_fail\:\d+/, (ctx) => {
  console.log("充值失败", ctx);
});
bot.action(/\/alipay_success\:\d+/, (ctx) => {
  console.log("充值成功", ctx);
});
/**
 * 转账
 */

bot.command("zhuanzhang", transStartHandler);
bot.action("/zhuanzhang", transStartHandler);
//转账操作开始
bot.command(["rmb_zz", "usdt_zz"], transHandler);

/**
 * 提现
 */
bot.command("tx", withdrawStartHandler);
bot.action("/tx", withdrawStartHandler);

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
bot.action(["/cny_tx", "/usdt_tx"], (ctx) => {
  ctx.scene.enter("withdrawAlipay");
});
bot.command(["cny_tx", "usdt_tx"], (ctx) => {
  ctx.scene.enter("withdrawAlipay");
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
