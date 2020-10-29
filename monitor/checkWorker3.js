require('dotenv').config()
const logger = require('./logger')('checkWorker3')
const stuckTransfers = require('./stuckTransfers')
const { writeFile, createDir } = require('./utils/file')
const { web3Home } = require('./utils/web3')

const { MONITOR_BRIDGE_NAME, COMMON_HOME_BRIDGE_ADDRESS } = process.env
const { getBridgeMode, HOME_NATIVE_TO_ERC_ABI, BRIDGE_MODES } = require('../commons')

async function checkWorker3() {
  try {
    const homeBridge = new web3Home.eth.Contract(HOME_NATIVE_TO_ERC_ABI, COMMON_HOME_BRIDGE_ADDRESS)
    const bridgeMode = await getBridgeMode(homeBridge)
    if (bridgeMode === BRIDGE_MODES.NATIVE_TO_ERC_V1) {
      createDir(`/responses/${MONITOR_BRIDGE_NAME}`)
      logger.debug('calling stuckTransfers()')
      const transfers = await stuckTransfers()
      if (!transfers) throw new Error('transfers is empty: ' + JSON.stringify(transfers))
      transfers.ok = transfers.total.length === 0
      transfers.health = true
      writeFile(`/responses/${MONITOR_BRIDGE_NAME}/stuckTransfers.json`, transfers)
      logger.debug('Done')
    }
  } catch (e) {
    logger.error('checkWorker3.js', e)
  }
}
checkWorker3()
