import express, { Response, Request } from 'express'

const ARRAY_SIZE = 100000000
const PARTITION_SIZE = 10000
const PORT = 42069

const app = express()

const RANDOM_ARRAY = (new Array<number>(ARRAY_SIZE)).map(() => Math.round(Math.random() * 1000))

const sleep = async (sleepMillisecs: number): Promise<void> => { return new Promise((resolve) => { setTimeout(resolve, sleepMillisecs) }) }

const calculateStuff = (value: number): number => {
  return value * Math.round(Math.random() * 1000) / Math.round(Math.random() * 1000)
}

const partitionedForEach = async <T>(array: Array<T>, callback: (param: T) => void, partitionSize = 1): Promise<void> => {
  return new Promise((resolve, reject) => {
    let index = 0
    const loop = () => {
      const partitionStartIndex = index
      const partitionEndIndex = Math.min(array.length, partitionStartIndex + partitionSize)
      for (let partitionIndex = partitionStartIndex; partitionIndex < partitionEndIndex; partitionIndex += 1) {
        try {
          callback(array[partitionIndex])
        } catch (err) {
          reject(err)
        }
      }
      index = partitionEndIndex
      if (index < array.length) {
        setImmediate(loop)
      } else {
        resolve()
      }
    }

    loop()
  })
}

const processUnpartitioned = async (array: Array<number>): Promise<void> => {
  return new Promise((resolve) => {
    for (let i = 0; i < array.length; i += 1) {
      array[i] = calculateStuff(array[i])
    }
    resolve()
  })
}

app.get('/', (_: Request, res: Response) => {
  res.status(200).send('beep-boop')
})

app.listen(PORT, async () => {
  console.log(`Server listening on port ${PORT}`)

  const isPartitioned = process.env.MODE === 'partitioned'
  if (isPartitioned) {
    console.log('Running PARTITIONED array processing...')
  } else {
    console.log('Running UNPARTITIONED array processing...')
  }

  while (true) {
    console.time('finished-a-batch')
    if (isPartitioned) {
      await partitionedForEach<number>(RANDOM_ARRAY, calculateStuff, PARTITION_SIZE)
    } else {
      processUnpartitioned(RANDOM_ARRAY)
    }
    console.timeEnd('finished-a-batch')
    await sleep(10)
  }
})

