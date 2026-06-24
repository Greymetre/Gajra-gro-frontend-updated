import React, { useEffect, useState } from 'react'
import { Button, Row, Col, Form, Card, Image } from 'react-bootstrap';
import BreadcrumbComponent from '../../components/Common/BreadcrumbComponent'
import Layout from '../../components/Layout'
import { backendGetSubCategoryInfo, backendPostAddNewSubCategory, backendPatchUpdateSubCategory } from '../../helpers/backend_helper'
import Router, { useRouter } from 'next/router';
import { CreateSubCategoryInterface, initialSubCategory } from '../../interfaces/category.interface';
import { objectAppendIntoformData } from '../../utils/utility';
import { BLUE_PLUS_CIRCLE_IMAGE, WHITE_CHECKED_IMAGE, IMAGE_URL } from '../../utils/constant';
import { useFormik } from 'formik';
import * as yup from "yup";
import SelectCategoryDropDown from '../../components/InputFields/SelectCategoryDropDown';
const schema = yup.object().shape({
    subcategoryName: yup.string()
        .min(4, "Mininum 4 characters")
        .max(50, "Maximum 30 characters")
        .required("Subcategory Name is required"),
    ranking: yup.number()
        .required('ranking is required'),
    subcategoryDescription: yup.string()
        .required('description is required'),
});
export default function SubCategorySave() {
    const router = useRouter()
    const { id } = router.query
    const fetchSubCategoryInfo = async () => {
        await backendGetSubCategoryInfo(id).then((res) => {
            if (!res.isError) {
                const { data } = res
                Object.keys(data).forEach(async (key) => {
                    if (key in initialSubCategory) {
                        formik.setFieldValue(key, data[key]);
                    }
                });
            }
        })
    }
    useEffect(() => {
        if (id) {
            fetchSubCategoryInfo()
        }
    }, [id])
    const [imageFile, setImageFile] = useState<File | undefined>(undefined);
    const [subcategoryImage, setSubcategoryImage] = useState<String>('')
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = event.target
        formik.setFieldValue(name, type === "number" ? parseInt(value) : value);
    }
    const handleFormSubmit = async () => {
        try {
            const formData = new FormData();
            const iData = await objectAppendIntoformData(formData, formik.values, '')
            await iData.append("image", imageFile);
            var actionSubmit = await (id) ? backendPatchUpdateSubCategory(id, iData) : backendPostAddNewSubCategory(iData)
            actionSubmit.then((result) => {
                if (!result.isError) {
                    formik.setSubmitting(true);
                    router.push('/subcategory');
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
    const formik = useFormik({
        initialValues: initialSubCategory,
        validationSchema: schema,
        onSubmit: handleFormSubmit,
        enableReinitialize: true
    });
    return (
        <Layout>
            <BreadcrumbComponent firstItem={{ href: '/dashboard', label: 'Home' }} secondItem={{ href: '/subcategory', label: 'SubCategoryList' }} itemlabel='List' />
            <Row>
                <Col xl={12} md={12}>
                    <Row className="align-items-center mb-4">
                        <Col md={6}>
                            <h3 className="card-body mb-0">{(id) ? 'Edit' : 'Add'} SubCategory</h3>
                        </Col>
                        <Card className="flat-card">
                            <Row>
                                <Col xl={6} md={6}>
                                    <Row className='align-items-center card-body'>
                                        <Col xl={6} md={6}>
                                            <div className="position-relative d-inline-block">
                                                <div className="avatar-upload">
                                                    <div className="avatar-edit">
                                                        <Form.Group controlId="formFile" className="mb-3" key="index">
                                                            <Form.Label><Image src={IMAGE_URL + BLUE_PLUS_CIRCLE_IMAGE} /></Form.Label>
                                                            <Form.Control type="file" name="image" accept="image/*"
                                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                                    setImageFile(event?.target?.files?.[0]!);

                                                                }}
                                                                required={true} />
                                                        </Form.Group>
                                                    </div>
                                                    <div className="avatar-preview">
                                                        <Image id="imagePreview" src={IMAGE_URL + subcategoryImage} style={{ borderRadius: "100%" }} />
                                                    </div>
                                                </div>
                                            </div>

                                        </Col>
                                    </Row>
                                </Col>
                                <Col xl={6} md={6}>
                                    <Row className='align-items-end card-body'>
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
                                                }}> <Image src={IMAGE_URL + WHITE_CHECKED_IMAGE} />  Save </Button>
                                        </Col>
                                    </Row>
                                </Col>
                                <Row className='p-4'>
                                    <Col md={4} sm={6} xs={12}>
                                        <Form.Group className="form-group">
                                            <Form.Label htmlFor="SubcategoryName">Subcategory Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="subcategoryName"
                                                onChange={handleInputChange}
                                                value={formik.values.subcategoryName}
                                                onBlur={formik.handleBlur}
                                                required={true}
                                                autoComplete='off'
                                                placeholder='Subcategory Name'
                                            />
                                            {formik.errors.subcategoryName && (
                                                <div className="text-danger">{formik.errors.subcategoryName}</div>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col md={4} sm={6} xs={12}>
                                        <Form.Group className="form-group">
                                            <Form.Label htmlFor="ranking">Ranking</Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="ranking"
                                                onChange={handleInputChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.ranking.toString()}
                                                autoComplete='off'
                                                placeholder='Ranking'
                                            />
                                            {formik.errors.ranking && (
                                                <div className="text-danger">{formik.errors.ranking}</div>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col md={4} sm={6} xs={12}>
                                        <SelectCategoryDropDown handleInputChange={handleInputChange} fieldname='categoryid' fieldvalue={formik.values.categoryid} />
                                    </Col>
                                    <Col md={6} sm={6} xs={6}>
                                        <Form.Group className="form-group">
                                            <Form.Label htmlFor="description">SubcategoryDescription</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="subcategoryDescription"
                                                onChange={handleInputChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.subcategoryDescription}
                                                autoComplete='off'
                                                as="textarea"
                                                placeholder='description'
                                            />
                                            {formik.errors.subcategoryDescription && (
                                                <div className="text-danger">{formik.errors.subcategoryDescription}</div>
                                            )}
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Row>
                        </Card>
                    </Row>
                </Col>
            </Row>
        </Layout>
    )
}

