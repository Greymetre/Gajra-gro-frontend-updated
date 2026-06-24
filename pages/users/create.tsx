import React, { useEffect, useState } from 'react'
import Router, { useRouter } from 'next/router';
import { Button, Row, Col, Form, Card, FormLabel, Image } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux'
import BreadcrumbComponent from '../../components/Common/BreadcrumbComponent'
import Layout from '../../components/Layout'
import { backendPostAddNewUser, backendPatchUpdateUser, backendGetUserInfo, backendPostAuthMobileExists, backendPostAuthEmailExists } from '../../helpers/backend_helper'
import MobileWithCode from '../../components/InputFields/MobileWithCode';
import AddressForm from '../../components/Common/AddressForm';
import { BLUE_PLUS_CIRCLE_IMAGE, IMAGE_URL, RECTANGLE_DEMO_IMAGE, WHITE_CHECKED_IMAGE } from '../../utils/constant';
import { objectAppendIntoformData } from '../../utils/utility';
import { CreateUserInterface, initialUserProfileData } from '../../interfaces/user.interface';
import { Formik, FormikHelpers, useFormik, useFormikContext } from 'formik';
import * as yup from "yup";
import SelectUserType from '../../components/InputFields/SelectUserType';
import CategoryCheckbox from '../../components/InputFields/CategoryCheckbox';

export default function UserSave() {
    const router = useRouter()
    const { id } = router.query
    const [gender, setGender] = useState(['Male', 'Female'])
    const fetchUserDetail = async () => {
        await backendGetUserInfo(id).then((res) => {
            if (!res.isError) {
                formik.setValues(res.data)
            }
        })
    }
    useEffect(() => {
        if (id) {
            fetchUserDetail()
        }
    }, [id])
    const [requestData, setRequestData] = useState<CreateUserInterface>(initialUserProfileData)
    const [avatarFile, setAvatarFile] = useState<File | undefined>(undefined);
    const handleInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target
        formik.setFieldValue(name, value);
    }
    const handleInputChecked = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = event.target
        var categories = (formik.values.categories) ? JSON.parse(JSON.stringify(formik.values.categories)) : [];
        if (checked) {
            categories.push(value);
        }
        else {
            categories = categories.filter(function (item: string) {
                return item !== value
            })
        }
        formik.setFieldValue(`categories`, categories);
    }
    const handleFormSubmit = async () => {
        try {
            const formData = new FormData();
            const iData = await objectAppendIntoformData(formData, formik.values, '')
            await iData.append("avatar", avatarFile);
            ['_id', 'active', 'createdAt', 'createdBy'].forEach(e => iData.delete(e));
            var actionSubmit = await (formik.values._id) ? backendPatchUpdateUser(formik.values._id, iData) : backendPostAddNewUser(iData)
            actionSubmit.then((result) => {
                if (!result.isError) {
                    router.push('/users');
                    formik.setSubmitting(true);
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
    const schema = yup.object().shape({
        firstName: yup.string()
            .min(2, "Too Short!")
            .max(250, "Too Long!")
            .required("Firstname is required"),
        lastName: yup.string()
            .min(2, "Too Short!")
            .max(250, "Too Long!")
            .required("Lastname is required"),
        password: yup.string(),
        email: yup.string().email()
            .required('email is required').test('unique', 'Email already exists', async function (value) {
                if (value) {
                    const exists = await checkEmailExists(value);
                    return !exists;
                }
                return true;
            }),
        mobile: yup.string().min(10, 'Enter valid Mobile No').max(10, 'Enter valid Mobile No').required('mobile is required').test('unique', 'Mobile number already exists', async function (value) {
            if (value && value.length === 10) {
                const exists = await checkMobileNumberExists(value);
                return !exists;
            }
            return true;
        }),
        gender: yup.string()
            .required('gender is required'),
        userType: yup.string()
            .required('userType Name is required'),
        dateOfBirth: yup.string()
            .min(2, "Must be more than 10 characters")
            .required('dateofbirth Name is required'),
        categories: yup.array()
            .of(yup.string().required('ObjectID is required'))
            .required('Category is required'),
    });

    async function checkMobileNumberExists(mobile: string) {
        return new Promise(async (resolve) => {
            await backendPostAuthMobileExists({ mobile: mobile, userid: id }).then((res) => {
                resolve(res.isError)
            }).catch((err) => {
                resolve(true)
            });
        });
    }

    async function checkEmailExists(email: string) {
        return new Promise(async (resolve) => {
            await backendPostAuthEmailExists({ email: email, userid: id }).then((res) => {
                resolve(res.isError)
            }).catch((err) => {
                resolve(true)
            });
        });
    }
    const formik = useFormik({
        initialValues: {
            _id: '',
            firstName: "",
            password: "",
            lastName: "",
            email: "",
            gender: "",
            mobile: "",
            dateOfBirth: "",
            userType: "",
            categories: [],
            address: {
                postalCode: "",
                address: "",
                city: "",
                state: "",
                country: "India"
            },

        },
        validationSchema: schema,
        onSubmit: handleFormSubmit,
        enableReinitialize: true
    });

    return (
        <Layout>
            <BreadcrumbComponent firstItem={{ href: '/dashboard', label: 'dashboard' }} secondItem={{ href: '/users', label: 'UserList' }} itemlabel='User List' />
            <Row>
                <Col xl={12} md={12}>
                    <Row className="align-items-center mb-4">
                        <Col md={6} className="mb-3">
                            <h3 className="card-body mb-0">{(id) ? 'Edit' : 'Add'} User Profile</h3>
                        </Col>
                        <Col md={6} className="text-end mb-3">
                            <Card.Body>
                                <div className="form-group d-flex align-items-center justify-content-end mb-0">
                                    <Form.Group>
                                        <Form.Label className='d-block m-r-10'></Form.Label>
                                        <div className='form-check form-switch custom-control-inline' >
                                            <Form.Check
                                                inline
                                                name="active"
                                                type="checkbox"
                                                onChange={(e) => {
                                                    setRequestData({
                                                        ...requestData,
                                                        active: e.target.checked
                                                    });
                                                }}
                                                defaultChecked={requestData.active}
                                            />
                                        </div>
                                    </Form.Group>
                                </div>
                            </Card.Body>
                        </Col>
                        <Card className="flat-card">
                            <Form>
                                <Row>
                                    <Col xl={7} md={7}>
                                        <Row className='align-items-center card-body'>
                                            <Col xl={6} md={6}>
                                                <div className="position-relative d-inline-block">
                                                    <div className="avatar-upload">
                                                        <div className="avatar-edit">
                                                            <Form.Group controlId="formFile" className="mb-3">
                                                                <Form.Label><Image src={IMAGE_URL + BLUE_PLUS_CIRCLE_IMAGE} /></Form.Label>
                                                                <Form.Control type="file" name="avatar" accept="image/*"
                                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                                        setAvatarFile(event?.target?.files?.[0]!);
                                                                    }}
                                                                    required={true} />
                                                            </Form.Group>
                                                        </div>
                                                        <div className="avatar-preview">
                                                            <Image id="imagePreview" className='width120' src={(requestData.avatar) ? IMAGE_URL + requestData.avatar : IMAGE_URL + RECTANGLE_DEMO_IMAGE} style={{ borderRadius: "100%" }} />
                                                        </div>
                                                        <Form.Label htmlFor="FirmName">Profile Image</Form.Label>
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col xl={5} md={5}>
                                        <Row className='align-items-end card-body'>
                                            <Col xl={12} md={12} className="text-end">
                                                <Button className="btn btn-dark" disabled={!formik.isValid}
                                                    onClick={() => {
                                                        if (formik.isValid) {
                                                            formik.handleSubmit();
                                                        }
                                                    }}
                                                ><Image src={IMAGE_URL + WHITE_CHECKED_IMAGE} />  Save </Button>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Row className='p-4'>
                                        <Col md={4} sm={6} xs={12}>
                                            <Form.Group className="form-group">
                                                <Form.Label htmlFor="FirmName">First Name</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="firstName"
                                                    onChange={handleInputChange}
                                                    value={formik.values.firstName}
                                                    required={true}
                                                    autoComplete='off'
                                                    onBlur={formik.handleBlur}
                                                    placeholder='First Name'
                                                />
                                                {formik.errors.firstName && (
                                                    <div className="text-danger">{formik.errors.firstName}</div>
                                                )}
                                            </Form.Group>
                                        </Col>
                                        <Col md={4} sm={6} xs={12}>
                                            <Form.Group className="form-group">
                                                <Form.Label htmlFor="LastName">Last Name</Form.Label>
                                                <Form.Control
                                                    onBlur={formik.handleBlur}
                                                    type="text"
                                                    name="lastName"
                                                    onChange={handleInputChange}
                                                    value={formik.values.lastName}
                                                    required={true}
                                                    autoComplete='off'
                                                    placeholder='Last Name'
                                                />
                                                {formik.errors.lastName && (
                                                    <div className="text-danger">{formik.errors.lastName}</div>
                                                )}
                                            </Form.Group>
                                        </Col>
                                        <Col md={4} sm={6} xs={12}>
                                            <Form.Group className="form-group">
                                                <Form.Label htmlFor="Email">Email</Form.Label>
                                                <Form.Control
                                                    type="email"
                                                    name="email"
                                                    onChange={handleInputChange}
                                                    value={formik.values.email}
                                                    required={true}
                                                    autoComplete='off'
                                                    onBlur={formik.handleBlur}
                                                    placeholder='Enter Email'
                                                />
                                                {formik.errors.email && (
                                                    <div className="text-danger">{formik.errors.email}</div>
                                                )}
                                            </Form.Group>
                                        </Col>


                                        <Col md={4} sm={6} xs={12}>
                                            <MobileWithCode key={"MobileCountryCode"} handleInputChange={handleInputChange} mobile={formik.values.mobile} />
                                            {formik.errors.mobile && (
                                                <div className="text-danger">{formik.errors.mobile}</div>
                                            )}
                                        </Col>
                                        <Col md={4} sm={6} xs={12}>
                                            <Form.Group className="form-group">
                                                <Form.Label htmlFor="Contactperson">Password</Form.Label>
                                                <Form.Control
                                                    type="password"
                                                    name="password"
                                                    onChange={handleInputChange}
                                                    required={true}
                                                    autoComplete='off'
                                                    placeholder='******'
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.password}
                                                />
                                                {formik.errors.password && (
                                                    <div className="text-danger">{formik.errors.password}</div>
                                                )}
                                            </Form.Group>
                                        </Col>
                                        <Col md={4} sm={6} xs={12}>
                                        <SelectUserType handleInputChange={handleInputChange} fieldname="userType" fieldvalue={formik.values.userType} />
                                        {formik.errors.userType && (
                                            <div className="text-danger">{formik.errors.userType}</div>
                                        )}
                                        </Col>
                                       
                                        
                                        {/* <Col md={4} sm={6} xs={12}>
                                            <Form.Group className="form-group">
                                                <Form.Label htmlFor="Usertype">User Type</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="userType"
                                                    onChange={handleInputChange}
                                                    value={formik.values.userType}
                                                    required={true}
                                                    autoComplete='off'
                                                    placeholder='Dealers'
                                                    onBlur={formik.handleBlur}
                                                />
                                                {formik.errors.userType && (
      <div className="text-danger">{formik.errors.userType}</div>
    )}
                                            </Form.Group>
                                        </Col> */}
                                        <Col md={4} sm={6} xs={12}>
                                            <Form.Group className="form-group">
                                                <Form.Label htmlFor="dateOfBirth"> Date of Birth</Form.Label>
                                                <Form.Control
                                                    type="date"
                                                    name="dateOfBirth"
                                                    onChange={handleInputChange}
                                                    value={formik.values.dateOfBirth}
                                                    onBlur={formik.handleBlur}
                                                    required={true}
                                                    autoComplete='off'
                                                    placeholder='Enter DOB'
                                                />
                                                {formik.errors.dateOfBirth && (
                                                    <div className="text-danger">{formik.errors.dateOfBirth}</div>
                                                )}
                                            </Form.Group>
                                        </Col>
                                        <Col md={4} sm={6} xs={12} className="mb-2">
                                            <Form.Group className="form-group mb-1 ">
                                                <Form.Label htmlFor="gender">Gender</Form.Label>
                                                <Form.Select name='gender' onBlur={formik.handleBlur} defaultValue={formik.values.gender} onChange={
                                                    (e: any) => handleInputChange(e)}>
                                                    <option selected disabled value="">Select Gender</option>
                                                    {gender.map((item: any, index) => (
                                                        <option key={index} value={item}>{item}</option>
                                                    ))}
                                                </Form.Select>
                                                {formik.errors.gender && (
                                                    <div className="text-danger">{formik.errors.gender}</div>
                                                )}
                                            </Form.Group>
                                        </Col>
                                        <AddressForm key={"AddressForm"} handleInputChange={handleInputChange} requestData={formik.values} errors={formik.errors} />
                                        <CategoryCheckbox key={"CategoryCheckbox"} handleInputChange={handleInputChecked} categories={formik.values.categories} errors={formik.errors.categories} />
                                    </Row>
                                </Row>
                            </Form>
                        </Card>
                    </Row>
                </Col>
            </Row>
        </Layout>
    )
}

