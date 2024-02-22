import Joi from 'joi';

const signUpVal = Joi.object({
    firstName: Joi.string().min(2).max(20).required(),
    lastName: Joi.string().min(2).max(20).required(),
    username: Joi.string().min(2).max(20).required(),
    email: Joi.string().required().email().trim(),
    password: Joi.string().required().pattern(/^[A-Z][a-z0-9#@]{8,40}$/),
    recoveryEmail: Joi.string().required().email(),
    DOB: Joi.date().required(),
    mobileNumber: Joi.number().required(),
    role: Joi.string().valid('Company_HR', 'user').default('user'),
    status: Joi.string().valid('Offline', 'Online').default('Offline')
});

const signinVal = Joi.object({
    email: Joi.string().email().trim(),
    mobileNumber: Joi.string(),
    password: Joi.string().required()
})
const changePasswordVal = Joi.object({
    password: Joi.string().required().pattern(/^[A-Z][a-z0-9#@]{8,40}$/),
    newPassword: Joi.string().required().pattern(/^[A-Z][a-z0-9#@]{8,40}$/),
})
const updateAccountVal = Joi.object({
    id: Joi.string(),
    firstName: Joi.string().min(2).max(20),
    lastName: Joi.string().min(2).max(20),
    email: Joi.string().email().trim(),
    mobileNumber: Joi.number(),
    recoveryEmail: Joi.string().email(),
    DOB: Joi.date(),
})
const forgetPasswordVal = Joi.object({
    email: Joi.string().email().trim().required(),
    otp: Joi.number().required(),
    newPassword: Joi.string().required().pattern(/^[A-Z][a-z0-9#@]{8,40}$/),
})

export {
    signUpVal,
    signinVal,
    changePasswordVal,
    updateAccountVal,
    forgetPasswordVal
}