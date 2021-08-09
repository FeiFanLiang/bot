
import bot from "./bot";
import './scenes/index'
import './commands'




bot.telegram.setMyCommands([
  {
    command: "start",
    description: "TG云支付 · 一键换汇",
  },
  {
    command: "alipay",
    description: "支付宝充值",
  },
  {
    command: "usdt",
    description: "usdt充值",
  },
  {
    command: "chongzhi",
    description: "充值",
  },

  {
    command: "rmb_zz",
    description: "支付宝转账",
  },
  {
    command: "usdt_zz",
    description: "usdt转账",
  },
  {
    command: "tx",
    description: "提现",
  },
  {
    command: "add_alipay_account",
    description: "添加支付宝提现地址",
  },
  {
    command: "add_usdt_address",
    description: "添加提币地址",
  },
  {
    command: "cny_tx",
    description: "人民币提现",
  },
  {
    command: "usdt_tx",
    description: "usdt提现",
  },
  {
    command: "fahongbao",
    description: "发红包",
  },
]);
bot.use((ctx,next) => {
  console.log(ctx)
  return next()
})

console.log('bot已启动',process.env.NODE_ENV)
bot.launch();

