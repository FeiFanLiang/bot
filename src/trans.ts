import {MyContext} from './type'
import {validateAmount} from './utils'

export const transStartHandler = (ctx:MyContext) => {
  ctx.reply(`请直接使用指令方式转账
  支付宝转账
  /rmb_zz @用户名称 金额
  usdt转账
  /usdt_zz @用户名称 金额
  `)
}

export const transHandler = (ctx:MyContext) => {
  //@ts-ignore
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
}


