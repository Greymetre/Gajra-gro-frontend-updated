import React, { useEffect, useState } from 'react'
import { Button, Row, Col, Form, Card, FormLabel, Image } from 'react-bootstrap';
import BreadcrumbComponent from '../../components/Common/BreadcrumbComponent'
import Layout from '../../components/Layout'
import { backendGetCategoryInfo, backendPatchUpdateCategory, backendPostAddNewCategory } from '../../helpers/backend_helper'
import Router, { useRouter } from 'next/router';
import { objectAppendIntoformData } from '../../utils/utility';
import { BLUE_PLUS_CIRCLE_IMAGE, WHITE_CHECKED_IMAGE, IMAGE_URL, RECTANGLE_DEMO_IMAGE } from '../../utils/constant';
import { useFormik } from 'formik';
import * as yup from "yup";
import { initialCategory, CreateCategoryInterface } from '../../interfaces/category.interface';
const schema = yup.object().shape({
    categoryName: yup.string()
        .min(4, "Mininum 4 characters")
        .max(50, "Maximum 50 characters")
        .required("name is required"),
    ranking: yup.string().required('ranking is required'),
    categoryDescription: yup.string().min(4, "Mininum 4 characters").max(50, "Maximum 50 characters"),
});

export default function CategorySave() {
    const router = useRouter()
    const { id } = router.query
    const fetchCategoryDetail = async () => {
        await backendGetCategoryInfo(id).then((res) => {
            if (!res.isError) {
                const { data } = res
                Object.keys(data).forEach(async(key) => {
                    if (key in initialCategory) {
                        formik.setFieldValue(key, data[key]);
                    }
                });
            }
        })
    }
    useEffect(() => {
        if (id) {
            fetchCategoryDetail()
        }
    }, [id])
    const [imageFile, setImageFile] = useState<File | undefined>();
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = event.target
        formik.setFieldValue(name, type === "number" ? parseInt(value) : value);
    }
    const handleFormSubmit = async () => {
        try {
            const formData = new FormData();
            const iData = await objectAppendIntoformData(formData, formik.values, '')
            if(imageFile){
                await iData.append("image", imageFile);
            }
            var actionSubmit = await (id) ? backendPatchUpdateCategory(id, iData) : backendPostAddNewCategory(iData)
            actionSubmit.then((result) => {
                if (!result.isError) {
                    router.push('/category');
                }
            }).catch((err) => {
            });
        }
        catch (e) {
            console.log(e, "Error in the Login");
        }
    };
    const formik = useFormik({
        initialValues: {
            _id: "",
            categoryName: "",
            categoryDescription: "",
            ranking: 1,
        },
        validationSchema: schema,
        onSubmit: handleFormSubmit,
        enableReinitialize : true
    });

    return (
        <Layout>
            <BreadcrumbComponent firstItem={{ href: '/dashboard', label: 'Home' }} secondItem={{ href: '/category', label: 'categoryList' }} itemlabel='Product List' />
            <Row>
                <Col xl={12} md={12}>
                    <Row className="align-items-center mb-4">
                        <Col md={6}>
                            <h3 className="card-body mb-0">{(id) ? 'Edit' : 'Add'}  Category</h3>
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
                                                        <Image id="imagePreview" src={IMAGE_URL + RECTANGLE_DEMO_IMAGE} />
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
                                            <Form.Label htmlFor="ProductName">Category Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="categoryName"
                                                onChange={handleInputChange}
                                                value={formik.values.categoryName}
                                                onBlur={formik.handleBlur}
                                                required={true}
                                                autoComplete='off'
                                                placeholder='Category Name'
                                            />
                                            {formik.errors.categoryName && (
                                                <div className="text-danger">{formik.errors.categoryName}</div>
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
                                    <Col md={6} sm={6} xs={6}>
                                        <Form.Group className="form-group">
                                            <Form.Label htmlFor="description">Category Description</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="categoryDescription"
                                                onChange={handleInputChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.categoryDescription}
                                                autoComplete='off'
                                                as="textarea"
                                                placeholder='Description'
                                            />
                                            {formik.errors.categoryDescription && (
                                                <div className="text-danger">{formik.errors.categoryDescription}</div>
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

