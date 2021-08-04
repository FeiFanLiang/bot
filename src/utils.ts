import TelegramBot from 'node-telegram-bot-api'

interface form {
  [key: string]: {
    validate?: (value: string) => boolean
    question: string
  }
}

type createForm = (chat_id: number | string, form: form, bot: TelegramBot) => Promise<{[key: string]: string}>

export const createForm: createForm = async (chat_id, form, bot) => {
  const formValues = {}
  for (let key in form) {
    const value = await runForm(chat_id, key, form[key], bot)
    formValues[key] = value
  }
  return formValues
}

const runForm = (chat_id: number | string, key: string, formItem: form['key'], bot: TelegramBot) => {
  return bot.sendMessage(chat_id, formItem.question, {
    disable_web_page_preview: true,
    reply_markup: {
      force_reply: true
    }
  }).then((messgae: TelegramBot.Message) => {
    return new Promise((resolve) => {
      const replyId = bot.onReplyToMessage(chat_id, messgae.message_id, (msg: TelegramBot.Message) => {
        bot.removeReplyListener(replyId)
        if (formItem.validate && formItem.validate(msg.text as string)) {
          resolve(msg.text)
        } else {
          resolve(runForm(chat_id, key, formItem, bot))
        }
      })
    })
  })
}
