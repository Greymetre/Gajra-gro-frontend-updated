import React, { useEffect, useState } from "react";
import Router, { useRouter } from "next/router";
import {
    Button,
    Container,
    Row,
    Col,
    Form,
    Card,
    FormLabel,
    Image,
    InputGroup,
    Spinner
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import BreadcrumbComponent from "../../components/Common/BreadcrumbComponent";
import Layout from "../../components/Layout";
import { initialPermissionRenderData, initialRolePermission, initialSettingData, PermissionRenderInterface, SettingInterface } from "../../interfaces/setting.interface";
import { settingFormValidation } from "../../validations/setting.validation";
import { backendGetPermissions, backendGetRolePermissions, backendUpdateRolePermission, getUserRoleList, } from "../../helpers/backend_helper";
import {
    BLACK_PLUS_CIRCLE_IMAGE, BLUE_PLUS_CIRCLE_IMAGE,
    CUSTOMER_DEMO_IMAGE, IMAGE_URL, WHITE_CHECKED_IMAGE,
} from "../../utils/constant";
import { useFormik, FieldArray } from "formik";
import * as yup from "yup";
const schema = yup.array().of(
    yup.object().shape({
        role: yup.string().required(`require feild`),
        canAccess: yup.array().required(`require field`),
    })
);
export default function SettingPermission() {
    const [isLoading, setIsLoading] = useState(true)
    const [isLoadingUserPermission, setIsLoadingUserPermission] = useState(true)
    const [permissions, setPermissions] = useState<PermissionRenderInterface>(initialPermissionRenderData)
    const permissionData = useSelector((state: any) => state?.permission?.permission);
    const moduleAccess = Array.isArray(permissionData) && Array.isArray(permissionData) && permissionData.reduce((acc: any, item: any) => {
        switch (item) {
            case 'permission.read':
                return { ...acc, canRead: true };
            case 'permission.update':
                return { ...acc, canUpdate: true };
            default:
                return acc;
        }
    }, {});
    const handleInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = event.target;
        formik.setFieldValue(name, value);
    };
    const handleFormSubmit = async () => {
        backendUpdateRolePermission(formik.values).then((result) => {
            if (!result.isError) {

            }
        }).catch((err) => {

        });
    };
    const formik = useFormik({
        initialValues: initialRolePermission,
        validationSchema: schema,
        onSubmit: handleFormSubmit,
        enableReinitialize: true,
    });
    const fetchPermissions = async () => {
        await backendGetPermissions().then(async (res) => {
            if (res.isError == false && res.data) {
                const { data } = res
                const grouped = data.reduce((acc: any, str: string) => {
                    const index = str.indexOf(".");
                    const key = index !== -1 ? str.substring(0, index) : str;
                    acc[key] = [...(acc[key] || []), str];
                    return acc;
                }, {});
                await setPermissions(grouped);
                setIsLoading(false)
            }
        });
    };
    const fetchRolePermissions = async () => {
        await backendGetRolePermissions().then((res) => {
            if (res.isError == false) {
                formik.setValues(res.data)
            }
            setIsLoadingUserPermission(false)
        });
    };
    useEffect(() => {
        fetchPermissions();
        fetchRolePermissions();
    }, []);
    console.log(isLoading);
    
    return (
        <Layout>
            <BreadcrumbComponent
                firstItem={{ href: "/dashboard", label: "dashboard" }}
                secondItem={{ href: "/setting", label: "Setting" }}
                itemlabel="Permission"
            />
            <Row>
                <Col xl={12} md={12}>
                    <Row className="align-items-center mb-4">
                        <Col md={6} className="mb-3">
                            <h3 className="card-body mb-0">Permission</h3>
                        </Col>
                        {(!isLoading && !isLoadingUserPermission) ?
                            <Card className="flat-card">

                                <Form>
                                    <Row className="align-items-center card-body">
                                        <Col xl={12} md={12} className="text-end">
                                            <Button className="btn btn-dark"
                                                disabled={!formik.isValid}
                                                onClick={() => {
                                                    if (formik.isValid) {
                                                        formik.handleSubmit();
                                                    }
                                                    else {
                                                        console.log("is invalid", !formik.isValid)
                                                    }
                                                }}
                                            >  <Image src={IMAGE_URL + WHITE_CHECKED_IMAGE} />Save </Button>

                                        </Col>
                                        {
                                            formik.values.map((permission, index: number) => (
                                                <Row key={index}>
                                                    <Col md={6} sm={6} xs={10}>
                                                        <Form.Label htmlFor="endedAt">Role Name</Form.Label>
                                                        <Form.Control
                                                            name={`[${index}].role`}
                                                            value={formik.values[index].role}
                                                            onChange={handleInputChange}
                                                            required={true} className="mb-1"
                                                            autoComplete='off'
                                                            placeholder='Enter Role Name'
                                                        />
                                                    </Col>
                                                    <Col md={12} sm={12} xs={12}>
                                                        {
                                                            Object.entries(permissions).map(([key, value], i) => {
                                                                return <Row key={key}>
                                                                    <Form.Label className="align-items-center m-4">{key.toUpperCase()}</Form.Label>
                                                                    {value.map((permission: string) => {
                                                                        return (<Col md={3} className="mb-2">
                                                                            <Form.Check
                                                                                inline
                                                                                className="form-check"
                                                                                name="canAccess"
                                                                                type="checkbox"
                                                                                value={permission}
                                                                                label={permission}
                                                                                onChange={(e) => {
                                                                                    const { checked } = e.target;
                                                                                    var permCanAccess = (formik.values[index].canAccess) ? JSON.parse(JSON.stringify(formik.values[index].canAccess)) : [];
                                                                                    if (checked) {
                                                                                        permCanAccess.push(e.target.value);
                                                                                    }
                                                                                    else {
                                                                                        permCanAccess = permCanAccess.filter(function (item: string) {
                                                                                            return item !== e.target.value
                                                                                        })
                                                                                    }
                                                                                    formik.setFieldValue(`[${index}][canAccess]`,
                                                                                        Array.from(new Set(permCanAccess))
                                                                                    );
                                                                                }}
                                                                                defaultChecked={Array.isArray(formik.values[index].canAccess) ? formik.values[index].canAccess.some((type) => type == permission) : false}
                                                                            />
                                                                        </Col>)
                                                                    })}
                                                                </Row>
                                                            })
                                                        }
                                                        {Array.isArray(permissions) && permissions.map((permission) => {
                                                            return (<Row key={index + '_' + permission}><Form.Check
                                                                inline
                                                                className="form-check"
                                                                name="canAccess"
                                                                type="checkbox"
                                                                value={permission}
                                                                label={permission}
                                                                onChange={(e) => {
                                                                    const { value, checked } = e.target;
                                                                    var permCanAccess = (formik.values[index].canAccess) ? JSON.parse(JSON.stringify(formik.values[index].canAccess)) : [];
                                                                    if (checked) {
                                                                        permCanAccess.push(value);
                                                                    }
                                                                    else {
                                                                        permCanAccess = permCanAccess.filter(function (item: string) {
                                                                            return item !== value
                                                                        })
                                                                    }

                                                                    formik.setFieldValue(`[${index}][canAccess]`,
                                                                        Array.from(new Set(permCanAccess))
                                                                    );
                                                                }}
                                                                defaultChecked={Array.isArray(formik.values[index].canAccess) ? formik.values[index].canAccess.some((type) => type == permission) : false}
                                                            /></Row>)
                                                        })}
                                                    </Col>
                                                </Row>
                                            ))
                                        }
                                    </Row>
                                    <Row className='align-items-end mt-5'>
                                        <Col xl={12} md={12} className="text-end">
                                            <div onClick={() => {
                                                const newRole = [
                                                    ...formik.values,
                                                    {
                                                        role: '',
                                                        canAccess: []
                                                    }
                                                ];
                                                formik.setValues(newRole);
                                            }}
                                            ><Image src={IMAGE_URL + BLACK_PLUS_CIRCLE_IMAGE} /> </div>
                                        </Col>
                                    </Row>
                                </Form>
                            </Card>
                            : <Spinner animation="border" />
                        }
                    </Row>
                </Col>
            </Row>
        </Layout>
    );
}
