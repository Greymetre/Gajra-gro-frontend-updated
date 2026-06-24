import MobileHeader from '../Header/MobileHeader'
import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import darklogo from '../../assets/logo/whitelogo.png'
export default function NonAuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <MobileHeader key="MobileHeader" />
      <nav className="pc-sidebar ">
        <div className="navbar-wrapper">
          <div className="m-header">
            <Link href="/" className="b-brand">
              <Image
                src={darklogo}
                alt="Gajragears"
                className="logo logo-lg"
              />
            </Link>
          </div>
          <div className="navbar-content">
            <ul className="pc-navbar">
              
              <li className="pc-item">
                <a href="#" className="pc-link ">
                  <span className="pc-mtext">
                  Sign In
                  {/* Log In */}
                  </span>
                </a>
              </li>

              <li className="pc-item">
                <a href="#!" className="pc-link ">
                  <i className="fas fa-headset m-r-10"></i>{' '}
                  <span className="pc-mtext">Support</span>
                </a>
              </li>

              <li className="pc-item">
                <a href="/catalogue" className="pc-link ">
                  <span className="pc-mtext">Catalogue</span>
                </a>
              </li>
              <li className="pc-item">
                <a href="/terms&condition" className="pc-link ">
                  <span className="pc-mtext">Term & Condition</span>
                </a>
              </li>
              <li className="pc-item">
                <a href="/privacypolicy" className="pc-link ">
                  <span className="pc-mtext">privacypolicy</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="pc-container loginpage">
        <div className="pcoded-content">{children}</div>
      </div>
    </>
  )
}
