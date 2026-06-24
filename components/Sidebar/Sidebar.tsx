import React, { useEffect, useState } from 'react'
import SidebarMenu from './SidebarMenu'
import { Nav, Navbar } from 'react-bootstrap'
import Image from 'next/image'
import Link from 'next/link'
import darklogo from '../../assets/logo/whitelogo.png'
const Sidebar = React.forwardRef(({ open }: { open: boolean }, ref) => {
  return (
    <>
      <div className="pc-sidebar">
        <div className="navbar-wrapper">
          <div className="m-header">
            <Link href="/dashboard" className="b-brand">
              <Image
                src={darklogo}
                alt="Gajragear"
                className="logo logo-lg"
              />
            </Link>
          </div>
          <div className="navbar-content">
            <Nav className="pc-navbar" as="ul">
              <SidebarMenu key="SidebarMenu" icon={true} />
            </Nav>
          </div>
        </div>
      </div>
    </>
  )
})

export default Sidebar
