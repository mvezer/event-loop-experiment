import express, { Response, Request } from 'express'

const ARRAY_SIZE = 100000000
const PORT = 42069

const app = express()

const RANDOM_ARRAY = (new Array<number>(ARRAY_SIZE)).map(() => Math.round(Math.random() * 1000))

const sleep = async (sleepMillisecs: number): Promise<void> => { return new Promise((resolve) => { setTimeout(resolve, sleepMillisecs) }) }

export const processUnpartitioned = (array: Array<number>): void => {
  for (let i = 0; i < array.length; i += 1) {
    array[i] = array[i] * Math.round(Math.random() * 1000) / Math.round(Math.random() * 1000)
  }
}

export const processPartitioned = (array: Array<number>): void => {
  for (let i = 0; i < array.length; i += 1) {
    array[i] = array[i] * Math.round(Math.random() * 1000) / Math.round(Math.random() * 1000)
  }
}

app.get('/', (_: Request, res: Response) => {
  res.status(200).send('beep-boop')
})

app.listen(PORT, async () => {
  console.log(`Server listening on port ${PORT}`)

  let doProcess
  if (process.env.MODE === 'unpartitioned') {
    console.log('Running UNPARTITIONED array processing...')
    doProcess = processUnpartitioned
  } else {
    console.log('Running PARTITIONED array processing...')
    doProcess = processUnpartitioned
  }

  while (true) {
    doProcess(RANDOM_ARRAY)
    await sleep(10)
  }
})

