import React from 'react'
import { Flex } from 'rebass'

import Link from '../Link'

const links = [
  { url: 'https://swap.taalswap.finance', text: 'About' },
  { url: 'https://app.gitbook.com/@taalswap/s/taalswap-docs-v-2-0/', text: 'Docs' },
  { url: 'https://github.com/taalswap/taalswap-info', text: 'Code' },
]

const FooterLink = ({ children, ...rest }) => (
  <Link external color="uniswappink" fontWeight={500} fontSize={12} mr={'8px'} {...rest}>
    {children}
  </Link>
)

const Footer = () => (
  <Flex as="footer" p={24}>
    {links.map((link, index) => (
      <FooterLink key={index} href={link.url}>
        {link.text}
      </FooterLink>
    ))}
  </Flex>
)

export default Footer
