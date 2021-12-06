import { tokens, ether, ETHER_ADDRESS, EVM_REVERT, wait } from './helpers'

const Token = artifacts.require('./Token')
const GypsyCity = artifacts.require('./GypsyCity')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('', ([deployer, user]) => {
  let gypsycity, token

  describe('', () => {
    describe('success', () => {
      it('', async () => {
        //expect(await)
      })
    })

    describe('failure', () => {
      it('', async () => {
        //await
      })
    })
  })
})