import TelegramBot from "node-telegram-bot-api";
const token = "";
const bot = new TelegramBot(token, {
  polling: true,
  // @ts-ignore
  request: {
    proxy: "http://127.0.0.1:7890",
  },
});

bot.on(
  "callback_query",
  async (msg) => {
    if(msg.data === 'pay'){
      
      bot.sendMessage(msg.message?.chat.id as number,'充值',{
        reply_markup:{
          inline_keyboard:[
            [
              {
                text:'人民币',
                callback_data:'CNY_pay'
              },
              {
                text:'USDT',
                callback_data:'USDT_pay'
              }
            ]
          ]
        }
      })
    }
    // bot.editMessageReplyMarkup(
    //   {
    //   inline_keyboard: [
    //     [
    //       {
    //         text: "2",
    //         callback_data: "1",
    //       },
    //       {
    //         text: "2",
    //         callback_data: "2",
    //       },
    //       {
    //         text: "3",
    //         callback_data: "3",
    //       },
    //     ],
    //     [
    //       {
    //         text: "4",
    //         callback_data: "4",
    //       },
    //       {
    //         text: "5",
    //         callback_data: "5",
    //       },
    //       {
    //         text: "6",
    //         callback_data: "6",
    //       },
    //     ],
    //     [
    //       {
    //         text: "7",
    //         callback_data: "7",
    //       },
    //       {
    //         text: "8",
    //         callback_data: "8",
    //       },
    //       {
    //         text: "9",
    //         callback_data: "9",
    //       },
    //     ],
    //   ],
    // },
    // {
    //   chat_id:msg.message?.chat.id,
    //   message_id:msg.message?.message_id
    // }
    // );
    
    
  }
);

bot.on("message", async (msg) => {
  console.log(msg);
  const chatInfo = await bot.getChat(msg.chat.id)
  console.log(chatInfo)
  bot.sendMessage(msg.chat.id,`<b>bold</b>, <strong>bold</strong>
  <i>italic</i>, <em>italic</em>
  <u>underline</u>, <ins>underline</ins>
  <s>strikethrough</s>, <strike>strikethrough</strike>, <del>strikethrough</del>
  <b>bold <i>italic bold <s>italic bold strikethrough</s> <u>underline italic bold</u></i> bold</b>
  <a href="http://www.example.com/">inline URL</a>
  <a href="tg://user?id=123456789">inline mention of a user</a>
  <code>inline fixed-width code</code>
  <pre>pre-formatted fixed-width code block</pre>
  <pre><code class="language-python">pre-formatted fixed-width code block written in the Python programming language</code></pre>`,{
    parse_mode:'HTML',
    reply_markup:{
      inline_keyboard:[
        [
          {
            text:'充值',
            callback_data:'pay'
          },
          {
            text:'转账',
            callback_data:'trans'
          },
          {
            text:'提现',
            callback_data:'takeOut'
          },
          {
            text:'发红包',
            callback_data:'redPack'
          }
        ]
      ]
    }
  })
  // bot.sendMessage(msg.chat.id,msg?.text as string,{
  //   reply_to_message_id:msg.message_id
  // })
  // bot.sendChatAction(msg.chat.id, "typing");
  // bot.sendMessage(msg.chat.id, "欢迎进入测试", {
  //   reply_markup: {
  //     inline_keyboard: [
  //       [
  //         {
  //           text: "1",
  //           callback_data: "1",
  //         },
  //         {
  //           text: "2",
  //           callback_data: "2",
  //         },
  //         {
  //           text: "3",
  //           callback_data: "3",
  //         },
  //       ],
  //       [
  //         {
  //           text: "4",
  //           callback_data: "4",
  //         },
  //         {
  //           text: "5",
  //           callback_data: "5",
  //         },
  //         {
  //           text: "6",
  //           callback_data: "6",
  //         },
  //       ],
  //       [
  //         {
  //           text: "7",
  //           callback_data: "7",
  //         },
  //         {
  //           text: "8",
  //           callback_data: "8",
  //         },
  //         {
  //           text: "9",
  //           callback_data: "9",
  //         },
  //       ],
  //     ],
  //   },
  // });
  // bot.sendMessage(msg.chat.id,'欢迎进入测试',{
  //   reply_markup:{
  //     keyboard:[
  //       [
  //         {
  //           text:'第一排1'
  //         },
  //         {
  //           text:'第一排2'
  //         },
  //         {
  //           text:'第一排3'
  //         }
  //       ],
  //       [
  //         {
  //           text:'第2排1'
  //         },
  //         {
  //           text:'第2排2'
  //         },
  //         {
  //           text:'第2排3'
  //         }
  //       ]
  //     ]
  //   }
  // })
  //bot.sendMessage(msg.chat.id,msg?.text as string)
});

