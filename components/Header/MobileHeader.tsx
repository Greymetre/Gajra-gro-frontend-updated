import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import darklogo from "../../assets/logo/whitelogo.png";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import { XCircleFill } from "react-bootstrap-icons";
import {
  Row,
  Col,
  Dropdown,
  Offcanvas,
  Button,
  Tabs,
  Tab,
} from "react-bootstrap";
import SidebarMenu from "../Sidebar/SidebarMenu";
function MobileHeader() {
  const [show, setShow] = useState(false);
  return (
    <>
      <div className="pc-mob-header pc-header">
        <div className="pcm-logo">
          <Image
            src={darklogo}
            alt="Field Konnect"
            style={{ height: "75px" }}
            className="logo logo-lg"
          />
          {show && (
            <XCircleFill
              size={24}
              color="white"
              onClick={() => setShow(false)}
            />
          )}
        </div>
        <div className="pcm-toolbar">
          <a
            href="#!"
            className="pc-head-link"
            id="mobile-collapse"
            onClick={() => setShow(true)}
          >
            <div className="hamburger hamburger--arrowturn">
              <div className="hamburger-box">
                <div className="hamburger-inner"></div>
              </div>
            </div>
          </a>
        </div>
      </div>
      <div className={"pc-sidebar " + (show ? "mob-sidebar-active" : "")}>
        <div className="navbar-wrapper">
          <div className="m-header">
            <Link href="/dashboard" className="b-brand">
              <Image src={darklogo} alt="Gajragear" className="logo logo-lg" />
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
  );
}

export default MobileHeader;
