import React, { useState, useEffect, useMemo, useRef } from 'react'
import styled from 'styled-components'

import Row, { RowFixed } from '../Row'
import TokenLogo from '../TokenLogo'
import { Search as SearchIcon, X } from 'react-feather'
import { BasicLink } from '../Link'

import { useAllTokenData, useTokenData } from '../../contexts/TokenData'
import { useAllPairData, usePairData } from '../../contexts/PairData'
import DoubleTokenLogo from '../DoubleLogo'
import { useMedia } from 'react-use'
import { useAllPairsInUniswap, useAllTokensInUniswap } from '../../contexts/GlobalData'
import { OVERVIEW_TOKEN_BLACKLIST, PAIR_BLACKLIST } from '../../constants'

import { transparentize } from 'polished'
import { client } from '../../apollo/client'
import { PAIR_SEARCH, TOKEN_SEARCH } from '../../apollo/queries'
import FormattedName from '../FormattedName'
import { TYPE } from '../../Theme'
import { updateNameData } from '../../utils/data'

const Container = styled.div`
  height: 48px;
  z-index: 30;
  position: relative;

  @media screen and (max-width: 600px) {
    width: 100%;
  }
`

const Wrapper = styled.div`
  display: flex;
  position: relative;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  padding: 12px 16px;
  border-radius: 12px;
  background: ${({ theme, small, open }) =>
    small ? (open ? transparentize(0.4, theme.bg1) : 'none') : transparentize(0.4, theme.bg6)};
  border-bottom-right-radius: ${({ open }) => (open ? '0px' : '12px')};
  border-bottom-left-radius: ${({ open }) => (open ? '0px' : '12px')};
  z-index: 9999;
  width: 100%;
  min-width: 500px;
  box-sizing: border-box;
  box-shadow: ${({ open, small }) =>
    !open && !small
      ? '0px 24px 32px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 0px 1px rgba(0, 0, 0, 0.04) '
      : 'none'};
  @media screen and (max-width: 500px) {
    background: ${({ theme }) => transparentize(0.4, theme.bg1)};
    box-shadow: ${({ open }) =>
      !open
        ? '0px 24px 32px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 0px 1px rgba(0, 0, 0, 0.04) '
        : 'none'};
  }
`
const Input = styled.input`
  // border: 1px solid red;
  position: relative;
  display: flex;
  align-items: center;
  white-space: nowrap;
  background: none;
  border: none;
  outline: none;
  width: 100%;
  color: ${({ theme }) => theme.text1};
  font-size: ${({ large }) => (large ? '12px' : '12px')};

  ::placeholder {
    color: ${({ theme }) => theme.text3};
    font-size: 16px;
  }

  @media screen and (max-width: 640px) {
    ::placeholder {
      font-size: 1rem;
    }
  }
`

const SearchIconLarge = styled(SearchIcon)`
  height: 20px;
  width: 20px;
  margin-right: 0.5rem;
  position: absolute;
  right: 10px;
  // pointer-events: none;
  color: ${({ theme }) => theme.text3};
  :hover {
    cursor: pointer;
  }
`

export const TxSearch = ({ small = false, setCondition }) => {
  const [value, setValue] = useState('')

  const below700 = useMedia('(max-width: 700px)')
  const below470 = useMedia('(max-width: 470px)')
  const below410 = useMedia('(max-width: 410px)')

  const onKeyPress = (e) => {
    if (e.key === 'Enter') {
      setCondition(value)
    }
  }

  return (
    <Container small={small}>
      <Wrapper shadow={true} small={small}>
        <Input
          large={!small}
          type={'text'}
          placeholder={'Search...'}
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
          }}
          onKeyPress={onKeyPress}
        />
        <SearchIconLarge onClick={() => setCondition(value)} />
      </Wrapper>
    </Container>
  )
}

export default TxSearch
