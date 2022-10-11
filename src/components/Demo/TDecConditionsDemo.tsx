/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { MessageKit, PolicyMessageKit, DeployedStrategy } from '@nucypher/nucypher-ts'
import React, { useState } from 'react'
import type { ConditionSet } from '@nucypher/nucypher-ts'
import { ethers } from 'ethers'

import { EnricoEncrypts } from './EnricoEncrypts'
import { BobDecrypts } from './BobDecrypts'
import { NetworkConfig } from './NetworkConfig'
import { ConditionList } from '../conditions/ConditionList'
import { StrategyBuilder } from './StrategyBuilder'
import { Spinner } from './Spinner'

export interface TDecConfig {
  label: string
}

export const getRandomLabel = () => `label-${new Date().getTime()}`

export const AliceGrants = () => {
  const [loading, setLoading] = useState(false)
  const [deployedStrategy, setDeployedStrategy] = useState<DeployedStrategy>()
  const [conditions, setConditions] = useState<ConditionSet>()
  const [encryptedMessage, setEncryptedMessage] = useState<MessageKit>()
  const [decryptedMessage, setDecryptedMessage] = useState('')
  const [decryptionErrors, setDecryptionErrors] = useState<string[]>([])

  const encryptMessage = (plaintext: string) => {
    setLoading(true)
    deployedStrategy!.encrypter.conditions = conditions
    const encryptedMessage = deployedStrategy!.encrypter.encryptMessage(plaintext)

    setEncryptedMessage(encryptedMessage)
    setLoading(false)
  }

  const decryptMessage = async (ciphertext: MessageKit) => {
    setLoading(true)
    setDecryptedMessage('')
    setDecryptionErrors([])

    const web3Provider = new ethers.providers.Web3Provider(window.ethereum)
    const conditionContext = deployedStrategy!.encrypter.conditions!.buildContext(web3Provider)

    const retrievedMessages = await deployedStrategy!.decrypter.retrieve([ciphertext], conditionContext)
    const decryptedMessages = retrievedMessages.map((mk: PolicyMessageKit) => {
      if (mk.isDecryptableByReceiver()) {
        return deployedStrategy!.decrypter.decrypt(mk)
      }

      // If we are unable to decrypt, we may inspect the errors and handle them
      if (Object.values(mk.errors).length > 0) {
        const ursulasWithErrors: string[] = Object.entries(mk.errors).map(([address, error]) => `${address} - ${error}`)
        setDecryptionErrors(ursulasWithErrors)
      } else {
        setDecryptionErrors([])
      }
      return new Uint8Array([])
    })

    setDecryptedMessage(new TextDecoder().decode(decryptedMessages[0]))
    setLoading(false)
  }

  if (loading) {
    return <Spinner loading={loading} />
  }

  return (
    <div style={{ display: 'grid', padding: '5px' }}>
      {/* TODO: Move config setup from strategy builder to network config */}
      {/* <NetworkConfig networkConfig={config} setNetworkConfig={setConfig} /> */}
      <StrategyBuilder setDeployedStrategy={setDeployedStrategy} setLoading={setLoading} />
      <ConditionList enabled={!!deployedStrategy} conditions={conditions} setConditions={setConditions} />
      <EnricoEncrypts enabled={!!conditions} encrypt={encryptMessage} encryptedMessage={encryptedMessage} />
      <BobDecrypts
        enabled={!!encryptedMessage}
        decrypt={decryptMessage}
        decryptedMessage={decryptedMessage}
        decryptionErrors={decryptionErrors}
      />
    </div>
  )
}
