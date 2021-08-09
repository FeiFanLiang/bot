import { Telegraf } from "telegraf";
import { SocksProxyAgent } from "socks-proxy-agent";
import { MyContext } from "./type";
const token = "1917863854:AAH-HkOjh58cddWz_kuvoWqXF3wStlv2SzQ";

const bot = new Telegraf<MyContext>(token, {
  telegram: {
    agent: process.env.NODE_ENV === 'production' ? undefined : new SocksProxyAgent("socks://127.0.0.1:7890"),
  },
});


export default bot