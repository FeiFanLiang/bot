export const validateAmount = (value:string) => {
  return /^\d+\.?\d{0,2}$/.test(value)
}
