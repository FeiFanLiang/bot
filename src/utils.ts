//@ts-nocheck
import { Markup } from "telegraf"
import { InlineKeyboardButton } from "telegraf/typings/core/types/typegram"
export const validateAmount = (value:string) => {
  return /^\d+\.?\d{0,2}$/.test(value)
}



export const getMarkUpButton = (array:any):InlineKeyboardButton[[]] => {
  return Markup.inlineKeyboard(array.map(item => item.map(button => Markup.button.callback(button.text,button.callback_data))))
}

export const formatterAmount = (value) => {
  return  (value / 100).toFixed(2)
}