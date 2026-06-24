import * as React from 'react'
import Link from 'next/link'
import {
  Row,
  Col,
} from 'react-bootstrap'
interface BreadcrumbItem {
  href: string
  label: string
}

export default function BreadcrumbComponent({
  firstItem,
  secondItem,
  itemlabel,
}: {
  firstItem: BreadcrumbItem
  secondItem: BreadcrumbItem
  itemlabel: string
}) {
  return (
    <div className="page-header">
      <div className="page-block">
        <Row className="align-items-center">
          <Col xs={6}>
            <div className="page-header-title">
              <h5 className="m-b-10">{itemlabel ? itemlabel : ''}</h5>
            </div>
            <ul className="breadcrumb">
              {firstItem.href ? (
                <li className="breadcrumb-item">
                  <Link href={firstItem.href}>{firstItem.label}</Link>
                </li>
              ) : (
                ''
              )}
              {secondItem.href ? (
                <li className="breadcrumb-item">
                  <Link href={secondItem.href}>{secondItem.label}</Link>
                </li>
              ) : (
                ''
              )}
            </ul>
          </Col>
        </Row>
      </div>
    </div>
  )
}
