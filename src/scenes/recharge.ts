import { Scenes, Markup,Composer } from "telegraf";
import { MyContext } from "../type";
import { validateAmount } from "../utils";
//import bot from "../bot";
import {getAlipayAddressApi,createRechargeApi} from '../api'
import { enterUserCenterHandler } from "../accountCenter";
import dayjs from 'dayjs'

interface rechargeState {
  userId?:any
  amount?:string | number
  time?:string
  usdtType?:string
}



export const rechargeAlipay = new Scenes.WizardScene<MyContext>(
  "rechargeAlipay",
  async (ctx) => {
    await ctx.reply(`ðµ æ¨è¦åå¼å¤å°é±ï¼åï¼ï¼ä¾ï¼200

    ð å¨ä¸é¢çè¾å¥æ¡ä¸­è¾å¥éé¢å¹¶åé`);
    const state:rechargeState = ctx.scene.state
    state.userId = ctx.from?.id.toString()
    return ctx.wizard.next();
  },
  async (ctx) => {
    if (ctx.message && "text" in ctx.message) {
      if (!validateAmount(ctx.message.text)) {
        await ctx.reply("éé¢è¾å¥æè¯¯,è¯·éæ°è¾å¥")
        return ctx.wizard.selectStep(1);
      } else {
        if(Number(ctx.message.text) < 100){
          await ctx.reply('äººæ°å¸åå¼çæå°éé¢ä¸º100å,è¯·éæ°è¾å¥')
          return ctx.wizard.selectStep(1)
        }
        const state:rechargeState = ctx.scene.state
        state.amount = ctx.message.text
        state.time = dayjs().format('YYYY/MM/DD HH:mm:ss')
        const res = await getAlipayAddressApi()
        //@ts-ignore
        const address = res?.address
        await ctx.reply(`æ¨æ­£å¨ä½¿ç¨æ¯ä»å®è¿è¡åå¼ï¼

åå¼ç¨æ·ï¼${ctx.from?.id}
åå¼éé¢ï¼${ctx.message.text} å
        
        
ðð»ðð»æ¯ä»å®åå¼æµç¨ðð»ðð»

1,ç¹å»å¤å¶è´¦å·ï¼  <${address}>
2,æå¼æ¯ä»å®APP
3,éæ©æ¯ä»å®è´¦å·è½¬è´¦
4,å¡«å¥è´¦å·,å¡«åéé¢å¹¶æ¯ä»
5,å®æåç¹å»å³ä¸è§,åå¼æå
         
ð­æ¸©é¦¨æéï¼
æ¬æ¬¡åå¼æ¯ä»å®è´¦å·é»è®¤è§ä¸ºæ¨çTGæ¯ä»æç°è´¦å·ï¼è¯·å¿ä½¿ç¨ä»äººè´¦å·è½¬è´¦ï¼åç¬åå¼éé¢å¤§äº50,000.00åæ¶ï¼è¯·èç³»å¨çº¿å®¢æè·åå¤§é¢åå¼ä¸ç¨ééï¼`,{
  parse_mode:'MarkdownV2',
  reply_markup:Markup.inlineKeyboard([
    Markup.button.callback('æ¯ä»å®æ','/confirm_alipay')
  ]).reply_markup
});
        return ctx.wizard.next();
      }
    } else {
      return ctx.wizard.back();
    }
  },
  async (ctx) =>  {
    //@ts-ignore
    const username = ctx.chat.username || ''
    const state:rechargeState = ctx.scene.state
    await ctx.editMessageText('ç¡®è®¤æ¶æ¬¾å,botä¼ä¸ºä½ åéç¡®è®¤éç¥')
    const res = await createRechargeApi({
      userId:state.userId,
      amount:state.amount
    })
    ctx.telegram.sendMessage(-1001592957188, `ð³ ç¨æ·åå¼:\nIDï¼${state.userId}\nç¨æ·å:${username}\nåå¼å¸ç§ï¼äººæ°å¸\nåå¼éé¢ï¼${state.amount}\nç³è¯·æ¶é´ï¼${state.time}\n *è¯·åæ¶å¨åå°è¿è¡å®¡æ ¸æä½åå¨æ­¤ç¡®è®¤è½¬è´¦*`
    , {
        parse_mode:'MarkdownV2',
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "ç¡®è®¤å°è´¦",
                callback_data: `/alipay_success:${res._id}`,
              },
              {
                text: "ç¡®è®¤æªå°è´¦",
                callback_data: `/alipay_fail:${res._id}`,
              },
            ],
          ],
        },
      });
      return ctx.scene.leave()
  }
);

const rechargeHandler = new Composer<MyContext>();
rechargeHandler.action('/cancel', async (ctx) => {
  enterUserCenterHandler(ctx)
  return ctx.scene.leave()
})
rechargeHandler.action('/confirm_usdt',async (ctx) =>  {
  //@ts-ignore
  const username = ctx.chat.username || ''
 const state:rechargeState = ctx.scene.state
 await ctx.editMessageText('ç¡®è®¤æ¶æ¬¾å,botä¼ä¸ºä½ åéç¡®è®¤éç¥')
 const res = await createRechargeApi({
   userId:state.userId,
   amount:state.amount
 })
 ctx.telegram.sendMessage(-1001592957188, `ð³ ç¨æ·åå¼:\nIDï¼${state.userId}\nç¨æ·å:${username}\nåå¼å¸ç§ï¼USDT\nåå¼éé¢ï¼${state.amount}\nç³è¯·æ¶é´ï¼${state.time}\n *è¯·åæ¶å¨åå°è¿è¡å®¡æ ¸æä½åå¨æ­¤ç¡®è®¤è½¬è´¦*`
 , {
     parse_mode:'MarkdownV2',
     reply_markup: {
       inline_keyboard: [
         [
           {
             text: "ç¡®è®¤å°è´¦",
             callback_data: `/usdt_success:${res._id}`,
           },
           {
             text: "ç¡®è®¤æªå°è´¦",
             callback_data: `/usdt_fail:${res._id}`,
           },
         ],
       ],
     },
   });
   return ctx.scene.leave()
})




export const rechargeUsdt = new Scenes.WizardScene<MyContext>(
  "rechargeUsdt",
  
  async (ctx) => {
    await ctx.reply(`ðµUSDTåå¼\n\nè¯·éæ©å¸é¾ç±»å`,{
  reply_markup:Markup.inlineKeyboard([Markup.button.callback('TRC20','/trc20'),Markup.button.callback('ERC20','/erc20')]).reply_markup
})
  return ctx.wizard.next()
  },

  async (ctx) => {
    
    await ctx.editMessageText(`ðµ æ¨è¦åå¼çä¸ªæ°ï¼ä¾ï¼200\n\nð å¨ä¸é¢çè¾å¥æ¡ä¸­è¾å¥éé¢å¹¶åé`);
    const state:rechargeState = ctx.scene.state
    //@ts-ignore
    const type = ctx.callbackQuery.data === '/trc20' ? 'trc20' : 'erc20'

    state.userId = ctx.from?.id.toString()
    state.usdtType = type;
    return ctx.wizard.next();
  },

  async (ctx) => {
    if (ctx.message && "text" in ctx.message) {
      if (!validateAmount(ctx.message.text)) {
        await ctx.reply("éé¢è¾å¥æè¯¯,è¯·éæ°è¾å¥")
        return ctx.wizard.selectStep(1);
      } else {
        if(Number(ctx.message.text) < 15){
          await ctx.reply('åå¼éé¢æå°ä¸º15ä¸ª,è¯·éæ°è¾å¥')
          return ctx.wizard.selectStep(1);
        }
        const state:rechargeState = ctx.scene.state
        state.amount = ctx.message.text
        state.time = dayjs().format('YYYY/MM/DD HH:mm:ss')
        if(state.usdtType === 'trc20'){
          await ctx.reply(`ð¦ USDT-TRC20 å­å¸é¡»ç¥\n\n\nâUSDT-TRC20 åå¼å°å\nï¼ææºç¨æ·ç¹å»ææ¬å¿«éå¤å¶ï¼\n<code>TKpp76rpHkH2MvQRENxfwweFTZzmj7UEnw</code>\nâè¯·ä½¿ç¨USDT-TRC20å­å¥ï¼è½¬éä¼å¯¼è´æ æ³å°è´¦ ã\nâåå¼å1ä¸ªå°æ¶åå°è´¦ä½é¢ï¼å¦æè¶æ¶æªå°è´¦ï¼è¯·èç³»å¨çº¿å®¢æ`, 
          {
            parse_mode:'HTML',
            reply_markup:Markup.inlineKeyboard([
              Markup.button.callback('æå·²åå¼å®æ','/confirm_usdt'),Markup.button.callback('åæ¶','/cancel')
            ]).reply_markup
          });
          return ctx.wizard.next();
        }else {
          await ctx.reply(`ð¦ ERC20ééæ­£å¨ç»´æ¤ä¸­ .. è¯·ä½¿ç¨TRC20è¿è¡å­å¥`)
          return ctx.scene.leave()
        }
      }
    } else {
      return ctx.wizard.back();
    }
  },
  rechargeHandler
);