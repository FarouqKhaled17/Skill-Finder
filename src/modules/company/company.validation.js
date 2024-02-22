import Joi from 'joi';
// Validation Schema for addCompany API
const addCompanyVal = Joi.object({
    companyName: Joi.string().min(2).required(),
    description: Joi.string().min(10).required(),
    industry: Joi.string().min(2).required(),
    address: Joi.string().min(2).required(),
    numberOfEmployees: Joi.number().required(),
    companyEmail: Joi.string().email().required(),
    companyHR: Joi.string().required(),
    collectionDate: Joi.date(),
});

// Validation Schema for updateCompany API
const updateCompanyVal = Joi.object({
    companyName: Joi.string().min(2),
    description: Joi.string().min(10),
    industry: Joi.string().min(2),
    address: Joi.string().min(2),
    numberOfEmployees: Joi.number(),
    companyEmail: Joi.string().email(),
    companyId: Joi.string(),
});


export {
    addCompanyVal,
    updateCompanyVal
}