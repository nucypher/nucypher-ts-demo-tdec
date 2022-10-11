import { Rinkeby } from '@usedapp/core'
import { PROVIDER_URL } from '.'

declare global {
  interface Window {
    ethereum: any
  }
}

export const addRinkebyNetwork = async () => {
  const provider = window.ethereum
  if (!provider) {
    return
  }
  try {
    await provider.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: Rinkeby.chainId,
          chainName: 'Alt Rinkeby',
          rpcUrls: [PROVIDER_URL],
          blockExplorerUrls: ['https://rinkeby.etherscan.io'],
          nativeCurrency: {
            symbol: 'RinkebyETH',
            decimals: 18,
          },
        },
      ],
    })
  } catch (addError) {
    console.log(addError)
  }

  // Switch
  try {
    await provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: Rinkeby.chainId }],
    })
  } catch (switchError) {
    // This error code indicates that the chain has not been added to MetaMask.
    if ((switchError as { code: number }).code === 4902) {
      console.log('This network is not available in your metamask, please add it')
    }
    console.log('Failed to switch to the network')
  }
}
