import express from "express";
import { validation } from "../../middleware/validation.js";
import { protectedRoutes } from "../../middleware/auth.js";
import { allowedTo } from "../../middleware/author.js";
import { addCompany, deleteCompany, getApplicationsForJobs, getCompany, searchForCompany, updateCompany } from "./company.controller.js";
import { isOwner } from "../../middleware/isOwner.js";
import { get } from "mongoose";
import { addCompanyVal, updateCompanyVal } from "./company.validation.js";

const companyRouter = express.Router();
companyRouter
    .post('/addCompany', protectedRoutes, allowedTo('Company_HR'), validation(addCompanyVal), addCompany)
    .put('/updateCompany/:companyId', protectedRoutes, allowedTo('Company_HR'), isOwner, validation(updateCompanyVal), updateCompany)
    .delete('/deleteCompany/:companyId', protectedRoutes, allowedTo('Company_HR'), isOwner, deleteCompany)
    .get('/getCompany/:companyId', protectedRoutes, allowedTo('Company_HR'), getCompany)
    .get('/searchForCompany', protectedRoutes, allowedTo('Company_HR', 'user'), searchForCompany)
    .get('/getApplication/:jobId', protectedRoutes, allowedTo('Company_HR'), getApplicationsForJobs)


export default companyRouter