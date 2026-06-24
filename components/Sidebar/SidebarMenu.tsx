import React, { useState, useEffect } from 'react'
import { Nav, Navbar } from 'react-bootstrap'
import Link from 'next/link'
import Image from 'next/image'
import {ShopWindow, Speedometer2, CurrencyDollar, BagCheckFill, AwardFill,
  GiftFill, QrCodeScan, GearWideConnected, GridFill, Dice4Fill, GearFill,
  ClipboardCheckFill, Clipboard2DataFill, PeopleFill, Headset, Tools,
  PersonCheckFill, GeoAltFill ,FileEarmarkExcel
} from 'react-bootstrap-icons'
import vectormenu from '../../assets/images/auth/Vectormenu.svg'
import { backendGetUserPermissions } from '../../helpers/backend_helper'
import { SidebarManuInterface } from '../../interfaces/setting.interface'
import { useDispatch, useSelector } from 'react-redux'

export default function SidebarMenu({ icon }: { icon: boolean }) {
    const [permissionData, setPermissionData] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const dispatch = useDispatch();
    const fetchPermissionData = async () => {
        setIsLoading(true)
        await backendGetUserPermissions().then(async(res) => {
            if (!res.isError) {
              setPermissionData(
  Array.isArray(res.data?.canAccess) ? res.data.canAccess : []
)
              dispatch({
                type: 'GET_PERMISSION',
                payload: res.data?.canAccess
              })
              setIsLoading(false)
            }
        })
    }
    useEffect(() => {
      fetchPermissionData()
    }, [])

  const manus = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: <Speedometer2 />,
      submanus: [],
      canAccess : "dashboard.read"
    },
    {
      label: 'Customers',
      href: '/customer',
      icon: <ShopWindow />,
      submanus: [],
      canAccess : "customers.read"
    },
    {
      label: 'Transaction',
      href: '/transaction',
      icon: <CurrencyDollar/>,
      submanus: [],
      canAccess : "transactions.read"
    },
    {
      label: 'Redemption',
      href: '/redemption',
      icon: <BagCheckFill/>,
      submanus: [],
      canAccess : "redemptions.read"
    },
    {
      label: 'Loyalty Scheme',
      href: '/loyaltyscheme',
      icon: <AwardFill/>,
      submanus: [],
      canAccess : "loyaltyscheme.read"
    },
    {
      label: 'Gifts', href: '/gifts',
      icon: <GiftFill/>,
      submanus: [],
      canAccess : "gift.read"
    },
    {
      label: 'QRcode',
      href: '/coupons',
      icon: <QrCodeScan/>,
      submanus: [],
      canAccess : "coupons.read"
    },

    {
      label: 'Damage QR Entries',
      href: '/damageentries',
      icon: <FileEarmarkExcel/>,
      submanus: [],
      canAccess : "damageCoupons.scan"
    },

    {
      label: 'Products',
      href: '/products',
      icon: <GearWideConnected/>,
      submanus: [{
        label: 'Category',
        href: '/category',
        icon:<GridFill/>,
        canAccess : "category.read"
      },
      {
        label: 'SubCategory',
        href: '/subcategory',
        icon:<Dice4Fill/>,
        canAccess : "subcategory.read"
      },{
        label: 'Products',
        href: '/products',
        icon: <GearFill/>,
        canAccess : "products.read"
      }],
      canAccess : "products.read"
    },
    {
      label: 'Reports', href: '/reports',
      icon: <ClipboardCheckFill/>,
      submanus: [{
        label: 'Otp Log',
        href: '/reports/otprequest',
        icon: <Clipboard2DataFill/>,
        submanus: [],
        canAccess : "reports.otprequest"
      }],
      canAccess : "reports.read"
    },
    {
      label: 'Users', href: '/users',
      icon: <PeopleFill/>,
      submanus: [],
      canAccess : "users.read"
    },
    {
      label: 'CallSummary',
      href: '/callsummary',
      icon: <Headset/>,
      submanus: [],
      canAccess : "callsummary.read"
    },
    {
      label: 'Settings',
      href: '/setting',
      icon: <Tools/>,
      submanus: [],
      canAccess : "setting.read"
    },
    {
      label: 'Permission',
      href: '/permission',
      icon: <PersonCheckFill/>,
      submanus: [],
      canAccess : "permission.read"
    },
    {
      label: 'Address',
      href: '/address',
      icon: <GeoAltFill/>,
      submanus: [],
      canAccess : "address.read"
    },
  ]
  
  return (
    <>
      {manus.map((item : SidebarManuInterface, index:number) => {
        if(Array.isArray(permissionData) && item.canAccess !== '' && permissionData.includes(item.canAccess)) {
        return <Nav.Item
          as="li"
          className="pc-item pc-hasmenu"
          style={{ width: '100%' }}
          key={index}
        >
          <Link className="pc-link " href={item.href}>
            <span className="pc-micon">{item.icon}</span>
            <span className="pc-mtext">{item.label}</span>
            {Array.isArray(item.submanus) && item.submanus.length > 0 ? (
              <span className="pc-arrow">
                <Image src={vectormenu} alt="" />
              </span>
            ) : (
              ''
            )}
          </Link>
          {Array.isArray(item.submanus) && item.submanus.length > 0 ? (
            <ul className="pc-submenu">
              {Array.isArray(item.submanus) &&
                item.submanus.map((manu :any, mindex:number) => {
                  if(Array.isArray(permissionData) && manu.canAccess !== '' && permissionData.includes(manu.canAccess)) {
                  return (
                    <li className="pc-item" key={'menu' + mindex}>
                      <Link className="pc-link " href={manu.href}>
                      <span className="pc-micon">{manu.icon}</span>
                        <span className="pc-mtext">{manu.label}</span>
                      </Link>
                    </li>
                  )
                  }
                })}
            </ul>
          ) : (
            ''
          )}
        </Nav.Item>
        }
      })}
    </>
  )
}
