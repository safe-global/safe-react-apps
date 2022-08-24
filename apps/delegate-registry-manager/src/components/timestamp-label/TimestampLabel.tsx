import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

type TimestampLabelProps = {
  getBlock: () => Promise<ethers.providers.Block>
}

// TODO: refine this component

const TimestampLabel = ({ getBlock }: TimestampLabelProps) => {
  const [timestamp, setTimestamp] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    getBlock()
      .then(block => {
        setTimestamp(block.timestamp)
      })
      .catch(e => {
        console.log('ERROR: ', e)
        // setTimestamp('error loading date')
      })
      .finally(() => {
        setIsLoading(false)
      })
  })

  return <span>{isLoading ? 'loading...' : new Date(timestamp * 1000).toLocaleDateString()}</span>
}

export default TimestampLabel
