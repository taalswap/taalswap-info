import React, { useState, useEffect } from 'react'
import { useMedia } from 'react-use'
import dayjs from 'dayjs'
import LocalLoader from '../LocalLoader'
import utc from 'dayjs/plugin/utc'
import { Box, Flex, Text, Link as RebassLink } from 'rebass'
import styled from 'styled-components'
import { Divider } from '../../components'
import { withRouter } from 'react-router-dom'
import { TYPE } from '../../Theme'
import axios from 'axios'
import FormattedName from '../FormattedName'
import { lighten, darken } from 'polished'

dayjs.extend(utc)

const PageButtons = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 2em;
  margin-bottom: 0.5em;
`

const Arrow = styled.div`
  color: ${({ theme }) => theme.primary1};
  opacity: ${(props) => (props.faded ? 0.3 : 1)};
  padding: 0 20px;
  user-select: none;
  :hover {
    cursor: pointer;
  }
`

const List = styled(Box)`
  -webkit-overflow-scrolling: touch;
`

const DashGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  grid-template-columns: 1fr 1fr 1fr 0.5fr;
  grid-template-areas: 'from amount xTxHash status';
  padding: 0 0.5rem;

  > * {
    justify-content: flex-end;

    :first-child {
      justify-content: flex-start;
      text-align: left;
      width: 20px;
    }
  }

  @media screen and (min-width: 600px) {
    padding: 0 0.5rem;
    grid-template-columns: 1fr 0.5fr 1fr 1fr 1fr 0.5fr;
    grid-template-areas: 'from amount createdAt txHash xTxHash status';
  }

  @media screen and (min-width: 740px) {
    padding: 0 0.5rem;
    grid-template-columns: 1fr 0.5fr 1fr 1fr 1fr 0.5fr;
    grid-template-areas: 'from amount createdAt txHash xTxHash status';
  }

  @media screen and (min-width: 1080px) {
    padding: 0 0.5rem;
    grid-template-columns: 1fr 0.5fr 1fr 1fr 1fr 0.5fr;
    grid-template-areas: 'from amount createdAt txHash xTxHash status';
  }
`

const ListWrapper = styled.div``

const RedCircle = styled.div`
  background-color: red;
  border-radius: 50%;
  width: 10px;
  height: 10px;
`

const GreenCircle = styled.div`
  background-color: green;
  border-radius: 50%;
  width: 10px;
  height: 10px;
`

const DataText = styled(Flex)`
  // border: 1px solid red;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: ${({ theme }) => theme.text1};

  & > * {
    font-size: 14px;
  }

  @media screen and (max-width: 600px) {
    font-size: 12px;
  }
`

const Link = styled(RebassLink)`
  color: ${({ color, theme }) => (color ? color : theme.link)};

  &:visited {
    color: ${({ color, theme }) => (color ? lighten(0.1, color) : lighten(0.1, theme.link))};
  }

  &:hover {
    cursor: pointer;
    text-decoration: none;
    underline: none;
    color: ${({ color, theme }) => (color ? darken(0.1, color) : darken(0.1, theme.link))};
  }
`

function XSwapList({ color, disbaleLinks, maxItems = 10, queryCondition }) {
  const below600 = useMedia('(max-width: 600px)')
  const below870 = useMedia('(max-width: 870px)')
  const below1080 = useMedia('(max-width: 1080px)')

  const [xSwapList, setXSWapList] = useState([])

  // pagination
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [maxPage, setMaxPage] = useState(1)
  const ITEMS_PER_PAGE = maxItems

  const ethDefaultUrl = 'https://ropsten.etherscan.io/tx'
  const klaytnDefaultUrl = 'https://baobab.scope.klaytn.com/tx'

  useEffect(() => {
    const getXSWapList = async () => {
      const url = queryCondition
        ? `http://localhost:4000/bridge/beta/api/history/${queryCondition}`
        : `http://localhost:4000/bridge/beta/api/history?page=${(page - 1) * pageSize}&pageSize=${pageSize}`

      await axios.get(url).then((response) => {
        setMaxPage(getMaxPage(response.data.totalCount))
        setXSWapList(response.data.data)
      })
    }

    getXSWapList()
  }, [page, queryCondition])

  const getMaxPage = (rowCount) => {
    let maxpage
    maxpage = rowCount % pageSize === 0 ? rowCount / pageSize : Math.ceil(rowCount / pageSize)
    if (isNaN(maxpage)) {
      maxpage = 1
      setPage(1)
    }
    return isNaN(maxpage) ? 1 : maxpage
  }

  const getDate = (createdAt) => {
    const date = new Date(new Date(createdAt).getTime() - 540 * 60 * 1000)

    const year = date.getFullYear()
    const month = date.getMonth()
    const day = date.getDate()

    const hour = ('0' + date.getHours()).slice(-2)
    const minutes = ('0' + date.getMinutes()).slice(-2)
    const seconds = ('0' + date.getSeconds()).slice(-2)

    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {!below870 ? (
          <div>{`${year}-${month}-${day} ${hour}:${minutes}:${seconds}`}</div>
        ) : (
          <>
            <div>{`${year}-${month}-${day}`}</div>
            <div>{`${hour}:${minutes}:${seconds}`}</div>
          </>
        )}
      </div>
    )
  }

  const getUrl = (txHash, fromChain) => {
    let url

    switch (fromChain.toUpperCase()) {
      case 'ETH':
        url = `${ethDefaultUrl}/${txHash}`
        break
      case 'KLAYTN':
        url = `${klaytnDefaultUrl}/${txHash}`
        break
    }

    return url
  }

  const shortenHash = (hash) => {
    return !below870 ? (
      <div>{hash.slice(0, 8) + '...' + hash.slice(-8)}</div>
    ) : (
      <div>{hash.slice(0, 4) + '...' + hash.slice(-4)}</div>
    )
  }
  const ListItem = ({ id, index }) => {
    const xSwapData = xSwapList[id]

    if (xSwapData) {
      return (
        <DashGrid
          style={{ height: '48px' }}
          disbaleLinks={disbaleLinks}
          focus={true}
          style={{ height: 'fit-content', minHeight: '45px' }}
        >
          <DataText area="amount" fontWeight="500">
            <Link
              style={{ marginLeft: '16px', whiteSpace: 'nowrap' }}
              href={getUrl(xSwapData.txHash, xSwapData.fromChain)}
              target="_blank"
            >
              {!below870 ? (
                <FormattedName text={xSwapData.from.slice(0, 6) + '...' + xSwapData.from.slice(-4)} link={true} />
              ) : (
                <FormattedName text={xSwapData.from.slice(0, 4) + '...' + xSwapData.from.slice(-3)} link={true} />
              )}
            </Link>
          </DataText>

          <DataText area="amount" fontWeight="500">
            <div>{xSwapData.amount}</div>
            {/* <div>200000</div> */}
          </DataText>

          {!below600 && (
            <DataText area="createdAt" fontWeight="500">
              {getDate(xSwapData.createdAt)}
            </DataText>
          )}
          {!below600 && (
            <DataText area="txHash" fontWeight="500">
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {shortenHash(xSwapData.txHash)}
                <div style={{ fontSize: '12px', color: xSwapData.fromChain === 'ETH' ? '#8a92ae' : '#675953' }}>
                  ({xSwapData.fromChain})
                </div>
              </div>
            </DataText>
          )}

          <DataText area="xTxHash" fontWeight="500">
            {xSwapData.xTxHash !== null ? (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {shortenHash(xSwapData.xTxHash)}
                <div style={{ fontSize: '12px', color: xSwapData.toChain === 'ETH' ? '#8a92ae' : '#675953' }}>
                  ({xSwapData.toChain})
                </div>
              </div>
            ) : (
              <div>-</div>
            )}
          </DataText>

          <DataText area="status" fontWeight="500">
            {xSwapData.status === 1 ? <GreenCircle /> : <RedCircle />}
          </DataText>
        </DashGrid>
      )
    } else {
      return ''
    }
  }

  const swapList =
    xSwapList &&
    Object.keys(xSwapList).map((id, index) => {
      return (
        id && (
          <div key={index}>
            <ListItem key={index} index={(page - 1) * ITEMS_PER_PAGE + index + 1} id={id} />
            <Divider />
          </div>
        )
      )
    })

  return (
    <ListWrapper>
      <DashGrid
        center={true}
        disbaleLinks={disbaleLinks}
        style={{ height: 'fit-content', padding: '0 1.125rem 1rem 1.125rem' }}
      >
        <Flex alignItems="center" justifyContent="center">
          <TYPE.main area="from">Hex</TYPE.main>
        </Flex>

        <Flex alignItems="center" justifyContent="center">
          <TYPE.main area="amount">Amount</TYPE.main>
        </Flex>

        {!below600 && (
          <Flex alignItems="center" justifyContent="center">
            <TYPE.main area="createdAt">Time</TYPE.main>
          </Flex>
        )}
        {!below600 && (
          <Flex alignItems="center" justifyContent="center">
            <TYPE.main area="from">From Chain</TYPE.main>
          </Flex>
        )}

        <Flex alignItems="center" justifyContent="center">
          <TYPE.main area="to">To Chain</TYPE.main>
        </Flex>

        <Flex alignItems="center" justifyContent="center">
          <TYPE.main area="status">Status</TYPE.main>
        </Flex>
      </DashGrid>
      <Divider />
      <List p={0}>{!swapList ? <LocalLoader /> : swapList}</List>
      <PageButtons>
        <div
          onClick={(e) => {
            setPage(page === 1 ? page : page - 1)
          }}
        >
          <Arrow faded={page === 1 ? true : false}>←</Arrow>
        </div>
        <TYPE.body>{'Page ' + page + ' of ' + maxPage}</TYPE.body>
        <div
          onClick={(e) => {
            setPage(page === maxPage ? page : page + 1)
          }}
        >
          <Arrow faded={page === maxPage ? true : false}>→</Arrow>
        </div>
      </PageButtons>
    </ListWrapper>
  )
}

export default withRouter(XSwapList)
