import { Composer, Context, Markup, Scenes, session, Telegraf } from "telegraf";
//@ts-ignore
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


const addAlipayAccount = new Scenes.WizardScene<MyContext>('addAlipayAccount',async (ctx) => {
  await ctx.reply('请输入要添加支付宝账号')
  return ctx.wizard.next()
},async (ctx) => {
  //添加账号
  await ctx.reply('添加账号成功')
  return ctx.scene.leave()
})

const addUsdtAddress = new Scenes.WizardScene<MyContext>('addUsdtAddress',async (ctx) => {
  await ctx.reply('请输入要添加的提币地址')
  return ctx.wizard.next()
},async (ctx) => {
  await ctx.reply('添加地址成功')
  return ctx.scene.leave()
})


const redPackStageHandler = new Composer<MyContext>();
redPackStageHandler.action('create_red_pack',async (ctx) => {
  await ctx.reply('请输入红包总金额')
  return ctx.wizard.next()
})


const redPack = new Scenes.WizardScene<MyContext>('redPack',async (ctx) => {
  await ctx.reply('请输入红包金额')
  return ctx.wizard.next()
},async (ctx) => {
  await ctx.reply('请输入红包个数')
  if(ctx.message && 'text' in ctx.message){

  }
  return ctx.wizard.next()
},async (ctx) => {
  if(ctx.message && 'text' in ctx.message){
    const text = ctx.message.text
    if(validateAmount(text)){
      //创建红包
      await ctx.reply('转发红包即可进行领取')
      await ctx.replyWithPhoto('https://images.669pic.com/element_min_new_pic/23/78/34/54/3b6214ba344d81e14d01d5ec53f630b1.png',Markup.inlineKeyboard([Markup.button.url('抢红包','https://t.me/Long_pay_bot?start=vCH1vGWJxfSeofSAs0K5PA')]))
      return ctx.scene.leave()
    }else {
      await ctx.reply('金额输入错误')
      return ctx.wizard.selectStep(2)
    }
  }
})

interface withdrawState {
  account?:string,
  amount?:number
}

const withdrawAlipay = new Scenes.WizardScene<MyContext>('withdrawAlipay',async (ctx) => {
  await ctx.reply('请选择要提现的账号',{
    reply_markup:{
      inline_keyboard:[
        [
          {
            text:'账号1',
            callback_data:'account1'
          }
        ],
        [
          {
            text:'账号2',
            callback_data:'account2'
          }
        ],
        [
          {
            text:'账号3',
            callback_data:'account3'
          }
        ],
        [
          {
            text:'账号4',
            callback_data:'account4'
          }
        ]
      ]
    }
  })
  return ctx.wizard.next()
},async (ctx) => {
  await ctx.reply('请输入提现金额')
  if(ctx.callbackQuery &&'data' in ctx.callbackQuery){
    const state:withdrawState = ctx.scene.state
    state.account = ctx.callbackQuery.data
  }
  return ctx.wizard.next()
},async (ctx) => {
  if(ctx.message && 'text' in ctx.message){
    const state:withdrawState = ctx.scene.state
    if(!validateAmount(ctx.message.text)){
      await ctx.reply('金额输入有误,请重新输入')
      return ctx.wizard.selectStep(2)
    }else {
      console.log(state)
      //提现相关逻辑
      bot.telegram.sendMessage(-476279416,'用户提现申请',Markup.inlineKeyboard([
        Markup.button.callback('提现成功',`withdraw_success:${ctx.from?.id}`),
        Markup.button.callback('提现失败',`withdraw_fail:${ctx.from?.id}`)
      ]))
      await ctx.reply('提现成功')
      return ctx.scene.leave()
    }
  }else {
    return ctx.wizard.back()
  }
})

const stage = new Scenes.Stage<MyContext>([transScene,addAlipayAccount,addUsdtAddress,withdrawAlipay,redPack])
const bot = new Telegraf<MyContext>(token, {
  telegram: {
    agent: new SocksProxyAgent("socks://127.0.0.1:7890"),
  },
});

bot.telegram.setMyCommands([{
  command:'start',
  description:'开始'
},
{
  command:'alipay',
  description:'支付宝充值'
},
{
  command:'usdt',
  description:'usdt充值'
},
{
  command:'chongzhi',
  description:'充值'
},

{
  command:'rmb_zz',
  description:'支付宝转账'
},
{
  command:'usdt_zz',
  description:'usdt转账'
},
{
  command:'tx',
  description:'提现'
},
{
  command:'add_alipay_account',
  description:"添加支付宝提现地址"
},
{
  command:'add_usdt_address',
  description:'添加提币地址'
},
{
  command:'cny_tx',
  description:'人民币提现'
},
{
  command:'usdt_tx',
  description:'usdt提现'
},
{
  command:'fahongbao',
  description:'发红包'
}
])

bot.action(/\/alipay_fail\:\d+/, (ctx) => {
  console.log("充值失败", ctx);
});
bot.action(/\/alipay_success\:\d+/, (ctx) => {
  console.log("充值成功", ctx);
});

bot.action("/confirm_alipay", (ctx) => {
  bot.telegram.sendMessage(-476279416, "用户充值", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "确认到账",
            callback_data: `/alipay_success:${ctx.from?.id}`,
          },
          {
            text: "确认未到账",
            callback_data: `/alipay_fail:${ctx.from?.id}`,
          },
        ],
      ],
    },
  });
});
bot.action("/confirm_usdt", (ctx) => {
  bot.telegram.sendMessage(-476279416, "usdt充值", {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "确认到账", callback_data: `/usdt_success:${ctx.from?.id}` },
          {
            text: "确认未到账",
            callback_data: `/usdt_fail:${ctx.from?.id}`,
          },
        ],
      ],
    },
  });
});
bot.action('/alipay',(ctx) => {
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
})
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
bot.action(['/usdt'],(ctx) => {
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
})
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
bot.action('/chongzhi',(ctx) => {
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
})
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
bot.command('start',async (ctx) =>{
  const redPackUid = ctx.message.text.replace(/\/start\s*(\S*)/,'$1')
  if(redPackUid){
   await ctx.reply('领取红包成功')
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
      ],
    },
  });
})

bot.use(session())
bot.use((ctx, next) => {
  const now = new Date()
  ctx.myContextProp = now.toString()
  return next()
})
bot.use(stage.middleware())
bot.launch();
bot.command('zhuanzhang',(ctx) => {
  ctx.reply(`请直接使用指令方式转账
  支付宝转账
  /rmb_zz @用户名称 金额
  usdt转账
  /usdt_zz @用户名称 金额
  `)
})
bot.action('/zhuanzhang',(ctx) => {
  ctx.reply(`请直接使用指令方式转账
  支付宝转账
  /rmb_zz @用户名称 金额
  usdt转账
  /usdt_zz @用户名称 金额
  `)
})

bot.command(['rmb_zz','usdt_zz'],(ctx) => {
  const {text} = ctx.message;
  const rmbReg = new RegExp(/\/rmb\_zz\s+\@(\S+)\s+([0-9.]+)/)
  const usdtReg = new RegExp(/\/usdt\_zz\s+\@(\S+)\s+([0-9.]+)/)
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
bot.action('tx',(ctx) => {
  ctx.reply('提现操作',{
    reply_markup:{
      inline_keyboard:[
        [
          {
            text:"支付宝提现",
            callback_data:'/cny_tx'
          },
          {
            text:'USDT提币',
            callback_data:'/usdt_tx'
          }
        ],
        [
          {
            text:'添加支付宝账号',
            callback_data:'/add_alipay_account'
          },
          {
            text:'添加usdt地址',
            callback_data:'/add_usdt_address'
          }
        ]
      ]
    }
  })
})
bot.command('tx',(ctx) => {
  ctx.reply('提现操作',{
    reply_markup:{
      inline_keyboard:[
        [
          {
            text:"支付宝提现",
            callback_data:'/cny_tx'
          },
          {
            text:'USDT提币',
            callback_data:'/usdt_tx'
          }
        ],
        [
          {
            text:'添加支付宝账号',
            callback_data:'/add_alipay_account'
          },
          {
            text:'添加usdt地址',
            callback_data:'/add_usdt_address'
          }
        ]
      ]
    }
  })
})



bot.action('/add_alipay_account',(ctx) => {
  ctx.scene.enter('addAlipayAccount')
})
bot.command('add_alipay_account',(ctx) => {
  ctx.scene.enter('addAlipayAccount')
})
bot.action('/add_usdt_address',(ctx) => {
  ctx.scene.enter('addUsdtAddress')
})
bot.command('add_usdt_address',(ctx) => {
  ctx.scene.enter('addUsdtAddress')
})
bot.action(['/cny_tx','/usdt_tx'],(ctx) =>{
  ctx.scene.enter('withdrawAlipay')
})
bot.command(['cny_tx','usdt_tx'],(ctx) => {
  ctx.scene.enter('withdrawAlipay')
})
bot.action('/fahongbao',(ctx) => {
  ctx.scene.enter('redPack')
})
bot.command('fahongbao',(ctx) => {
  ctx.scene.enter('redPack')
})
