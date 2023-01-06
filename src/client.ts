import axios from 'axios'

const PORT = 42069
const sleep = async (sleepMillisecs: number): Promise<void> => { return new Promise((resolve) => { setTimeout(resolve, sleepMillisecs) }) }
const doStuff = async () => {
  console.log('Start experiment')
  while (true) {
    console.time('call-duration')
    await axios.get(`http://localhost:${PORT}`)
    console.timeEnd('call-duration')
    await sleep(1000)
  }
}
(() => doStuff())()
