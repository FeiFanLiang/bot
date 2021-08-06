import {MyContext} from './type'


const template = `
我的个人中心
人民币:20
USDT:20`


export const enterUserCenterHandler = (ctx:MyContext) => {
  ctx.reply(template)
}
