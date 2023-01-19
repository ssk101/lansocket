import { parentPort, workerData } from 'worker_threads'
import { zxec } from '../services/zxec.mjs'
import { connect } from '../scripts/barrier/connect.mjs'

const {
  newHost,
  processHost,
} = await connect()

process.exit(0)