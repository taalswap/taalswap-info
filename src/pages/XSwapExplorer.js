import React, { useEffect, useState } from 'react'
import 'feather-icons'

import { TYPE } from '../Theme'
import Panel from '../components/Panel'
import { PageWrapper, FullWrapper } from '../components'
import { RowBetween } from '../components/Row'
import { useMedia } from 'react-use'
import XSwapList from '../components/XSwapList'

function XSwapExplorer() {
  const [xSWapList, setXSWapList] = useState([])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const below800 = useMedia('(max-width: 800px)')

  return (
    <PageWrapper>
      <FullWrapper>
        <RowBetween>
          <TYPE.largeHeader>X-Swap Explorer</TYPE.largeHeader>
          {/* {!below800 && <Search small={true} />} */}
        </RowBetween>
        <Panel style={{ padding: below800 && '1rem 0 0 0 ' }}>
          <XSwapList disbaleLinks={true} maxItems={50} />
        </Panel>
      </FullWrapper>
    </PageWrapper>
  )
}

export default XSwapExplorer
