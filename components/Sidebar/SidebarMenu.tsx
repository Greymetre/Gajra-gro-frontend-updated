import { useRouter } from 'next/router'
import { getAuthToken, removeAuthToken } from '../../helpers/authHelper'
import React, { useState, useEffect } from 'react'
import { Nav, Navbar } from 'react-bootstrap'
import Link from 'next/link'
import Image from 'next/image'
import {ShopWindow, Speedometer2, CurrencyDollar, BagCheckFill, AwardFill,
  GiftFill, QrCodeScan, GearWideConnected, GridFill, Dice4Fill, GearFill,
  ClipboardCheckFill, Clipboard2DataFill, PeopleFill, Headset, Tools,
  PersonCheckFill, GeoAltFill ,FileEarmarkExcel, MegaphoneFill, ChevronDown
} from 'react-bootstrap-icons'
import { backendGetUserPermissions } from '../../helpers/backend_helper'
import { SidebarManuInterface } from '../../interfaces/setting.interface'
import { useDispatch, useSelector } from 'react-redux'

export default function SidebarMenu({ icon }: { icon: boolean }) {
    const [permissionData, setPermissionData] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const dispatch = useDispatch();
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState('');
    useEffect(() => {
      let cancelled = false;
      const fetchPermissionData = async () => {
        setIsLoading(true);
        try {
          const storedToken = await getAuthToken();
          let token: unknown;
          try { token = storedToken ? JSON.parse(storedToken) : null; } catch { token = null; }
          if (typeof token !== 'string' || !token) {
            if (!cancelled) {
              setPermissionData([]);
              dispatch({ type: 'GET_PERMISSION', payload: [] });
            }
            return;
          }
          const res = await backendGetUserPermissions();
          if (cancelled) return;
          const permissions = !res.isError && Array.isArray(res.data?.canAccess) ? res.data.canAccess : [];
          setPermissionData(permissions);
          dispatch({ type: 'GET_PERMISSION', payload: permissions });
        } catch (error: any) {
          if (cancelled) return;
          setPermissionData([]);
          dispatch({ type: 'GET_PERMISSION', payload: [] });
          if (error.response?.status === 401) {
            await removeAuthToken();
            void router.replace('/').catch(() => {});
          } else {
            setErrorMessage('Unable to load the menu. Please refresh the page.');
          }
        } finally {
          if (!cancelled) setIsLoading(false);
        }
      };
      void fetchPermissionData();
      return () => { cancelled = true; };
    }, [dispatch, router]);

  const manus = [
    {
      group: 'Operations',
      label: 'Dashboard',
      href: '/dashboard',
      icon: <Speedometer2 />,
      submanus: [],
      canAccess : "dashboard.read"
    },
    {
      group: 'Operations',
      label: 'Customers',
      href: '/customer',
      icon: <ShopWindow />,
      submanus: [],
      canAccess : "customers.read"
    },
    {
      group: 'Operations',
      label: 'Transaction',
      href: '/transaction',
      icon: <CurrencyDollar/>,
      submanus: [],
      canAccess : "transactions.read"
    },
    {
      group: 'Operations',
      label: 'Redemption',
      href: '/redemption',
      icon: <BagCheckFill/>,
      submanus: [],
      canAccess : "redemptions.read"
    },
    {
      group: 'Operations',
      label: 'Loyalty Scheme',
      href: '/loyaltyscheme',
      icon: <AwardFill/>,
      submanus: [],
      canAccess : "loyaltyscheme.read"
    },
    {
      group: 'Operations',
      label: 'Gifts', href: '/gifts',
      icon: <GiftFill/>,
      submanus: [],
      canAccess : "gift.read"
    },
    {
      group: 'Operations',
      label: 'QRcode',
      href: '/coupons',
      icon: <QrCodeScan/>,
      submanus: [],
      canAccess : "coupons.read"
    },

    {
      group: 'Operations',
      label: 'Damage QR Entries',
      href: '/damageentries',
      icon: <FileEarmarkExcel/>,
      submanus: [],
      canAccess : "damageCoupons.scan"
    },

    {
      group: 'Catalog',
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
      group: 'Reports',
      label: 'Reports', href: '/reports',
      icon: <ClipboardCheckFill/>,
      submanus: [{
        label: 'Otp Log',
        href: '/reports/otprequest',
        icon: <Clipboard2DataFill/>,
        submanus: [],
        canAccess : "reports.otprequest"
      },
      {
        label: 'Cashfree Report',
        href: '/reports/cashfree',
        icon: <CurrencyDollar/>,
        submanus: [],
        canAccess : "reports.cashfree"
      }],
      canAccess : "reports.read"
    },
    {
      group: 'Reports',
      label: 'News Management',
      href: '/notifications',
      icon: <MegaphoneFill/>,
      submanus: [],
      canAccess : "news.read"
    },
    {
      group: 'Administration',
      label: 'Users', href: '/users',
      icon: <PeopleFill/>,
      submanus: [],
      canAccess : "users.read"
    },
    {
      group: 'Administration',
      label: 'CallSummary',
      href: '/callsummary',
      icon: <Headset/>,
      submanus: [],
      canAccess : "callsummary.read"
    },
    {
      group: 'Administration',
      label: 'Settings',
      href: '/setting',
      icon: <Tools/>,
      submanus: [],
      canAccess : "setting.read"
    },
    {
      group: 'Administration',
      label: 'Permission',
      href: '/permission',
      icon: <PersonCheckFill/>,
      submanus: [],
      canAccess : "permission.read"
    },
    {
      group: 'Administration',
      label: 'Address',
      href: '/address',
      icon: <GeoAltFill/>,
      submanus: [],
      canAccess : "address.read"
    },
  ]
  
  const pathname = router.pathname || ''
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')
  const allowed = (key: string) => Array.isArray(permissionData) && key !== '' && permissionData.includes(key)

  // menu items the user may see, with only their allowed sub items
  const visible = manus
    .filter((item: any) => allowed(item.canAccess))
    .map((item: any) => ({ ...item, submanus: (item.submanus || []).filter((sub: any) => allowed(sub.canAccess)) }))

  // a group with sub items opens by itself when one of its pages is open
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({})
  const isOpen = (item: any) =>
    openMenus[item.label] ?? item.submanus.some((sub: any) => isActive(sub.href))
  const toggle = (item: any) => setOpenMenus((prev) => ({ ...prev, [item.label]: !isOpen(item) }))

  const groupOrder: string[] = []
  visible.forEach((item: any) => { if (!groupOrder.includes(item.group)) groupOrder.push(item.group) })

  return (
    <>
      {errorMessage && <li className="pc-item" role="alert">{errorMessage}</li>}
      {groupOrder.map((group) => (
        <React.Fragment key={group}>
          <li className="pc-caption sb-caption"><label>{group}</label></li>
          {visible.filter((item: any) => item.group === group).map((item: any) => {
            const hasSub = item.submanus.length > 0
            const open = hasSub && isOpen(item)
            const childActive = hasSub && item.submanus.some((sub: any) => isActive(sub.href))
            return (
              <Nav.Item
                as="li"
                className={`pc-item sb-item ${hasSub ? 'pc-hasmenu' : ''} ${open ? 'pc-trigger' : ''} ${!hasSub && isActive(item.href) ? 'active' : ''} ${childActive ? 'sb-child-active' : ''}`}
                style={{ width: '100%' }}
                key={item.label}
              >
                {hasSub ? (
                  <a
                    className="pc-link sb-link"
                    role="button"
                    tabIndex={0}
                    aria-expanded={open}
                    onClick={() => toggle(item)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(item) } }}
                  >
                    <span className="pc-micon">{item.icon}</span>
                    <span className="pc-mtext">{item.label}</span>
                    <span className="pc-arrow sb-arrow"><ChevronDown /></span>
                  </a>
                ) : (
                  <Link className="pc-link sb-link" href={item.href} aria-current={isActive(item.href) ? 'page' : undefined}>
                    <span className="pc-micon">{item.icon}</span>
                    <span className="pc-mtext">{item.label}</span>
                  </Link>
                )}
                {hasSub ? (
                  <ul className="pc-submenu sb-submenu">
                    {item.submanus.map((manu: any) => (
                      <li className={`pc-item ${isActive(manu.href) ? 'active' : ''}`} key={manu.label}>
                        <Link className="pc-link sb-link" href={manu.href} aria-current={isActive(manu.href) ? 'page' : undefined}>
                          <span className="pc-micon">{manu.icon}</span>
                          <span className="pc-mtext">{manu.label}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </Nav.Item>
            )
          })}
        </React.Fragment>
      ))}
    </>
  )
}
