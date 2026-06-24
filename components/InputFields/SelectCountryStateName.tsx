import React, { useState, useEffect } from 'react'
import Router from 'next/router'
import { Row, Col, Form } from 'react-bootstrap';
import { backendGetCountriesDropdown, backendGetCountryStates } from '../../helpers/backend_helper'
import { SelectDropDownInterface } from '../../interfaces/pagination.interface';
import Select from 'react-select';

export default function SelectCountryStateName({ handleInputChange, country, state }: { handleInputChange: any; country: string  ; state :string}) {
    const [countryData, setCountryData] = useState<Array<SelectDropDownInterface>>([])
    const [stateData, setStateData] = useState<Array<SelectDropDownInterface>>([])
    const [selectedCountry, setSelectedCountry] = useState<SelectDropDownInterface>()
    const [selectedState, setSelectedState] = useState<SelectDropDownInterface>()


    const fetchCountryData = async () => {
        await backendGetCountriesDropdown().then((res) => {
            if(!res.isError)
            {
                setCountryData(res.data)
            }
        })
      }
      const fetchStateData = async () => {
        await backendGetCountryStates({country:country}).then((res) => {
            if(!res.isError)
            {
                setStateData(res.data)
            }
        })
      }
      useEffect(() => {
        fetchCountryData()
      }, [])

      useEffect(() => {
        fetchStateData()
        if(country && countryData?.length > 0 ){
            const item = countryData.find((type) => type.value == country)
            setSelectedCountry(item)
           }
      }, [country , countryData])

      useEffect(() => {
        if(state && stateData?.length > 0    ){
        


            const item = stateData.find((type) => type.value == state)

           
            setSelectedState(item)
           }
      }, [state , stateData  ])
    return (
        <>
            <Row>
            <Col md={6} sm={12} xs={12}>
                    <Form.Group className="mb-1">
                        <Form.Label htmlFor="Country">Country</Form.Label>
                        <Select options={countryData} name='country' value={selectedCountry} onChange={(e: any) => handleInputChange({
                            target: {
                                name: 'country',
                                value: e.value,
                                type: 'select',
                            }
                        })} isSearchable />
                    </Form.Group>
                </Col>
                <Col md={6} sm={12} xs={12}>
                    <Form.Group className="mb-1">
                        <Form.Label htmlFor="State">State</Form.Label>
                        <Select options={stateData} name='state' value={selectedState} onChange={(e: any) => handleInputChange({
                            target: {
                                name: 'state',
                                value: e.value,
                                type: 'select',
                            }
                        })} isSearchable />
                    </Form.Group>
                </Col>
            </Row>
        </>
    )
}
