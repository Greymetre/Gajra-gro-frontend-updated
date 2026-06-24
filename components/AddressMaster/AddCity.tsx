import React from 'react'
import { Button, Form, Row, Col, Image, InputGroup } from 'react-bootstrap';
import { WHITE_CHECKED_IMAGE, IMAGE_URL} from '../../utils/constant'
import { backendPostAddNewCity, backendPatchUpdateCity } from "../../helpers/backend_helper"
import SelectCountryStateName from '../InputFields/SelectCountryStateName';
import { useFormik } from 'formik';
import * as yup from "yup";
// import { useRouter } from 'next/router';


const schema = yup.object().shape({
    cityName: yup.string().min(3).required("cityName is required"),
    country : yup.string().min(3).required("Country is required"),
    state : yup.string().min(3).required("State is required"),
    pincode : yup.array().of(yup.string().min(6).max(6).required("Pincode is required")),
});

export default function AddCity(props: any) {
    // const router = useRouter()
    // const { id } = router.query;
    const { handleVisible ,initialCityData} = props;

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = event.target
        formik.setFieldValue(name, (type === "number") ? parseInt(value) : value);
    }

    const handleFormSubmit = async () => {
        try {
            var iData = await JSON.parse(JSON.stringify(formik.values));
            await delete iData["_id"];
            await delete iData["active"];
            var actionSubmit = await (initialCityData?._id) ? backendPatchUpdateCity(initialCityData?._id, iData) : backendPostAddNewCity(iData)
            actionSubmit.then((result) => {
                if (!result.isError) {
                    handleVisible('CityList')
                }
                else {
                }
            }).catch((err) => {

            });
        }
        catch (e) {
            console.log(e, "Error in the Login");
        }
    };
console.log(initialCityData , "initialCityData")
    const formik = useFormik({
        initialValues:{
          cityName: initialCityData?.cityName && initialCityData?.cityName ? initialCityData.cityName : "",
          pincode:  initialCityData  && initialCityData?.pincode?.length > 0 ? initialCityData?.pincode : [''],
          country:  initialCityData  && initialCityData?.country ? initialCityData?.country :'India',
          state: initialCityData  && initialCityData?.state ? initialCityData?.state :''
      } ,
        validationSchema: schema,
        onSubmit: handleFormSubmit,

    });
    // console.log('error', formik.errors);
    
    return (
        <>
            <Row className="p-4">
                <Col md={12} sm={12} xs={12} className="text-end">
                    <Form.Group className="form-group">
                        <Button type="submit" onClick={handleFormSubmit} className="btn text-white bg-dark float-right"><Image src={IMAGE_URL + WHITE_CHECKED_IMAGE} /> Save</Button>
                    </Form.Group>
                </Col>
                <Col md={4} sm={6} xs={12}>
                    <Form.Group className="form-group">
                        <Form.Label className="form-label">City Name </Form.Label>
                        <Form.Control type="text" name="cityName" onChange={handleInputChange} value={formik.values.cityName} placeholder="Enter City" className="form-control" />
                    </Form.Group>
                    {formik.errors.cityName && (
                        <div className="text-danger">
                          {/* {formik.errors.cityName} */}
                          {typeof formik.errors.cityName === "string"
                          ? formik.errors.cityName
                          : ""}
                          </div>
                     
                    )}
              
                </Col>
                <Col md={8} sm={12} xs={12}>
                    <Form.Group className="form-group">
                        <SelectCountryStateName handleInputChange={handleInputChange} country={formik.values.country} state={formik.values.state} />
                        {formik.errors.country && (
                        <div className="text-danger">
                          {/* {formik.errors.country} */}
                          {typeof formik.errors.country === "string"
                          ? formik.errors.country
                          : ""}
                          </div>
                    )}
                    </Form.Group>
                </Col>
                <Col sm={4}>
                      <Form.Group>
                        <Form.Label htmlFor="callstatus">
                        Pincode
                        </Form.Label>
                        { Array.isArray(formik.values.pincode) &&
                          formik.values.pincode.map((item, index) => {
                            return (
                              <>
                                <InputGroup className="mb-3">
                                  <Form.Control
                                    type="text"
                                    name="calltypes"
                                    onChange={(e) => {
                                      formik.setFieldValue(
                                        `pincode[${index}]`,
                                        e.target.value
                                      );
                                    }}
                                    value={item}
                                    required={true}
                                    autoComplete="off"
                                    placeholder="Enter Pincode"
                                  />
                                  <InputGroup.Text
                                    onClick={async () => {
                                      const types = await formik.values.pincode.filter(
                                        (e: string) => e !== item
                                      );
                                      formik.setFieldValue(
                                        "pincode",
                                        types
                                      );
                                    }}
                                    className="bg-danger text-white"
                                  >
                                    x
                                  </InputGroup.Text>
                                </InputGroup>
                                
                              </>
                            );
                          })}
                           {formik.errors.pincode && (
                                <div className="text-danger">
                                  {/* {formik.errors.pincode} */}
                                  {typeof formik.errors.pincode === "string"
                          ? formik.errors.pincode
                          : ""}
                                  </div>
                            )}
                        <button
                          type="button"
                          onClick={() => {
                            const types = formik.values.pincode;
                            types.push('');
                            formik.setFieldValue(
                              "pincode",
                              types
                            );
                          }}
                        >
                          +
                        </button>
                      </Form.Group>
                    </Col>
            </Row>
        </>
    )
}