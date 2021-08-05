import { Composer, Context, Markup, Scenes, session, Telegraf } from "telegraf";
import { SocksProxyAgent } from "socks-proxy-agent";
import {validateAmount} from './utils'

const token = "1917863854:AAH-HkOjh58cddWz_kuvoWqXF3wStlv2SzQ";
if (token === undefined) {
  throw new Error("BOT_TOKEN must be provided!");
}

interface MySession extends Scenes.WizardSession {
  // will be available under `ctx.session.mySessionProp`
  amount: number;
  username: string;
}


interface MyContext extends Context {
  // will be available under `ctx.myContextProp`
  myContextProp: string;
  // declare session type
  session: MySession;
  // declare scene type
  scene: Scenes.SceneContextScene<MyContext, Scenes.WizardSessionData>;
  // declare wizard type
  wizard: Scenes.WizardContextWizard<MyContext>;
}

interface transContext extends Context {
  // will be available under `ctx.myContextProp`
  myContextProp: string;
  // declare session type
  session: MySession;
  // declare scene type
  scene: Scenes.SceneContextScene<MyContext, Scenes.WizardSessionData>;
  // declare wizard type
  wizard: Scenes.WizardContextWizard<MyContext>;
}


interface transState {
  username?:string
  amount?:number
  type:'CNY' | 'USDT'
}

const stepHandler = new Composer<MyContext>();
stepHandler.action("confirm_trans", async (ctx) => {
  //转账
  await ctx.reply('转账成功')
  return ctx.scene.leave();
});
stepHandler.action('cancel_trans',async (ctx) => {
  //取消
  await ctx.reply('取消转账')
  return ctx.scene.leave()
})

const transScene = new Scenes.WizardScene(
  "trans",
  async (ctx) => {
    const state = ctx.scene.state as transState
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
const stage = new Scenes.Stage<transContext>([transScene])
const bot = new Telegraf<MyContext>(token, {
  telegram: {
    agent: new SocksProxyAgent("socks://127.0.0.1:7890"),
  },
});



bot.hears(/\/alipay_fail\:\d+/, (ctx) => {
  console.log("充值失败", ctx);
});
bot.hears(/\/alipay_success\:\d+/, (ctx) => {
  console.log("充值成功", ctx);
});

bot.hears("confirm_alipay", (ctx) => {
  bot.telegram.sendMessage(-476279416, "用户充值", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "确认到账",
            callback_data: `/alipay_success:${ctx.from.id}`,
          },
          {
            text: "确认未到账",
            callback_data: `/alipay_fail:${ctx.from.id}`,
          },
        ],
      ],
    },
  });
});
bot.hears("confirm_usdt", (ctx) => {
  bot.telegram.sendMessage(-476279416, "usdt充值", {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "确认到账", callback_data: `/usdt_success:${ctx.from.id}` },
          {
            text: "确认未到账",
            callback_data: `/usdt_fail:${ctx.from.id}`,
          },
        ],
      ],
    },
  });
});
bot.command("alipay", (ctx) => {
  ctx.reply("支付邮箱xxxxxxx.com,请付款", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "支付完成",
            callback_data: `/confirm_alipay`,
          },
        ],
      ],
    },
  });
});

bot.command("usdt", (ctx) => {
  ctx.reply("充值地址xxxxxxx,请充值", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "充值完成",
            callback_data: "/confirm_usdt",
          },
        ],
      ],
    },
  });
});

bot.command("chongzhi", (ctx) => {
  ctx.reply("选择充值渠道", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "支付宝",
            callback_data: "/alipay",
          },
          {
            text: "USDT-TRC20",
            callback_data: "/usdt",
          },
        ],
      ],
    },
  });
});

bot.command("start_a", (ctx) => {
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
            callback_data: "/tixian",
          },
          {
            text: "红包",
            callback_data: "/hongbao",
          },
        ],
      ],
    },
  });
});

bot.use(session())
bot.use((ctx, next) => {
  const now = new Date()
  ctx.myContextProp = now.toString()
  return next()
})
bot.use(stage.middleware())
bot.launch();
bot.command("zhuanzhang", (ctx) => {
  ctx.scene.enter('trans')
});

bot.command(['rmb_zz','usdt_zz'],(ctx) => {
  const {text} = ctx.message;
  const rmbReg = new RegExp(/rmb\_zz\s+\@(\S+)\s+([0-9.]+)/)
  const usdtReg = new RegExp(/usdt\_zz\s+\@(\S+)\s+([0-9.]+)/)
  const isCNY = text.startsWith('rmb_zz') ? 'CNY' : 'USDT'
  
  const username = text.replace(isCNY ? rmbReg : usdtReg,'$1')
  const amount = text.replace(isCNY ? rmbReg:usdtReg,'$2')
  
  if(username && amount && validateAmount(amount)){
    ctx.scene.enter('trans',{
      type:isCNY,
      username,
      amount:parseFloat(amount)
    })
  }else {
    ctx.reply('输入有误')
  }
})


