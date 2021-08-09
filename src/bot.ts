import { Telegraf } from "telegraf";
import { SocksProxyAgent } from "socks-proxy-agent";
import { MyContext } from "./type";
const token = "1918270709:AAF9dh072fYBxO6Kn58D3-KyZFuIwuez-Yc";

const bot = new Telegraf<MyContext>(token, {
  telegram: {
    agent: process.env.NODE_ENV === 'production' ? undefined : new SocksProxyAgent("socks://127.0.0.1:7890"),
  },
});


export default bot