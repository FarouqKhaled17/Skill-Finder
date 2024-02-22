import express from "express";
import { SignIn, SignUp, changePassword, deleteAccount, forgetPassword, getAccounts, getProfile, getUserData, sendOTP, updateAccount } from "./user.controller.js";
import { emailExist } from "../../middleware/emailExist.js";
import { changePasswordVal, forgetPasswordVal, signUpVal, signinVal, updateAccountVal } from "./user.validation.js";
import { validation } from "../../middleware/validation.js";
import { mobileNumberExist } from "../../middleware/mobileNumberExist.js";
import { protectedRoutes } from "../../middleware/auth.js";
import { allowedTo } from "../../middleware/author.js";
import { isOwner } from "../../middleware/isOwner.js";

const userRouter = express.Router();
userRouter
    .post('/signup', validation(signUpVal), emailExist, SignUp)
    .post('/signin', validation(signinVal), SignIn)
    .post('/sendOTP', sendOTP)
    .post('/forgetPassword', validation(forgetPasswordVal), forgetPassword)
    .patch('/changePassword', protectedRoutes, allowedTo('user'), validation(changePasswordVal), changePassword)
    .put('/updateAccount/:id', protectedRoutes, emailExist, mobileNumberExist, validation(updateAccountVal), updateAccount)
    .delete('/deleteAccount/:id', protectedRoutes, deleteAccount)
    .get('/getProfile/:id',isOwner, getProfile)
    .get('/getAccount', getAccounts)
    .get('/getUserData/:id', protectedRoutes, getUserData)

export default userRouter