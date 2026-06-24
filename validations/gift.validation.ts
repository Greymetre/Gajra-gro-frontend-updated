import * as yup from 'yup';
export const giftFormValidation = () => yup.object({
    giftName: yup.string().trim()
                .min(2, 'Too Short!').max(100, 'Too Long!')
                .required('Gift Name is required'),
    brand: yup.string().trim()
                .min(2, 'Too Short!').max(100, 'Too Long!')
                .required('Brand Name is required'),
    giftType: yup.string().trim()
                .min(2, 'Too Short!').max(100, 'Too Long!')
                .required('Gift Type is required'),
    mrp: yup.number().required('MRP is required'),
    points: yup.number().required('Points is required'),
    price: yup.number().required('Points is required'),
    model: yup.string().trim()
                .min(2, 'Too Short!').max(100, 'Too Long!')
                .required('Model Name is required'),
    giftDescription: yup.string().trim()
                .min(2, 'Too Short!').max(400, 'Too Long!')
                .required('Description is required'),
  });