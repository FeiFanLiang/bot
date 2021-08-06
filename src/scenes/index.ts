import { transScene } from "./trans";
import { addAlipayAccount, addUsdtAddress, withdrawAlipay } from "./withdraw";
import { redPack } from "./redPack";
import { MyContext } from "../type";
import { Scenes,session } from "telegraf";
import bot from '../bot'


const stage = new Scenes.Stage<MyContext>([
  transScene,
  addAlipayAccount,
  addUsdtAddress,
  withdrawAlipay,
  redPack,
]);

bot.use((ctx,next) => {
  if(ctx?.chat?.type === 'group' && ctx.message && 'entities' in ctx.message && ctx?.message?.entities?.find(el => el.type === 'bot_command')){
    return 
  }else {
    return next()
  }
})
bot.use(session());
bot.use(stage.middleware());

export default stage;
