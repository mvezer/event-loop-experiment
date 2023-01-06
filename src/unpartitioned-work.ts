export const process = (array: Array<number>): void => {
  for (let i = 0; i < array.length; i += 1) {
    array[i] = array[i] * Math.round(Math.random() * 1000) / Math.round(Math.random() * 1000)
  }
}
