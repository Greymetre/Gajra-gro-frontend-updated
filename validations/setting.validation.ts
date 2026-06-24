import * as yup from 'yup';
export const settingFormValidation = () => yup.object().shape({
    loyaltyscheme: yup.object().shape({
        coupon_based: yup.boolean(),
        sales_based: yup.boolean(),
        customerType_based: yup.boolean(),
    }),
    points: yup.object().shape({
        point_value: yup.string(),
        welcome: yup.string().required('LinkedIn username is required'),
    }),
    redemption: yup.object().shape({
        threshold: yup.string(),
        milestone_points: yup.string().required('LinkedIn username is required'),
        automated: yup.string().required('LinkedIn username is required'),
        approval: yup.string().required('LinkedIn username is required'),
    }),
    helpdesk: yup.object().shape({
        phone: yup.string().required('phone is required'),
        email: yup.string().email().required('email is required'),
        whatsapp: yup.string().required(' whatsapp is required'),
    }),
    socialmedia: yup.object().shape({
        facebook: yup.string().matches(
            /(?:https?:\/\/)?(?:www\.)?facebook\.com\/(?:(?:\w)*#!\/)?(?:[\w\-]*\/)*([\w\-\.]*)/,
            'Enter correct Facebook url'),
        youtube: yup.string().matches(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/(?:(?:\w)*#!\/)?(?:[\w\-]*\/)*([\w\-\.]*)/,
            'Enter correct Youtube url'),
        instagram: yup.string().matches(/(?:https?:\/\/)?(?:www\.)?instagram\.com\/(?:(?:\w)*#!\/)?(?:[\w\-]*\/)*([\w\-\.]*)/,
            'Enter correct url!'
        ),
        linkedin: yup.string().matches(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/(?:(?:\w)*#!\/)?(?:[\w\-]*\/)*([\w\-\.]*)/,
            'Enter correct LinkedIn url'),
        twitter: yup.string().matches(/(?:https?:\/\/)?(?:www\.)?twitter\.com\/(?:(?:\w)*#!\/)?(?:[\w\-]*\/)*([\w\-\.]*)/,
            'Enter correct Twitter url'),
    }),
    catalogue: yup.object().shape({
        privacy: yup.string(),
        terms: yup.string(),
        loyalty: yup.string(),
    }),
});