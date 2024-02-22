import express from "express";
import { protectedRoutes } from "../../middleware/auth.js";
import { isOwner } from "../../middleware/isOwner.js";
import { allowedTo } from "../../middleware/author.js";
import { addJob, applyForJob, deleteJob, getFilteredJobs, getJobsForCompany, getJobsWithCompanyInfo, updateJob } from "./job.controller.js";
import { jobOwner } from "../../middleware/jobOwner.js";


const jobRouter = express.Router();
jobRouter
    .post('/addJob', protectedRoutes, allowedTo('Company_HR'), addJob)
    .put('/updateJob/:jobId', protectedRoutes, allowedTo('Company_HR'), jobOwner, updateJob)
    .delete('/deleteJob/:jobId', protectedRoutes, allowedTo('Company_HR'), jobOwner, deleteJob)
    .get('/getJobs', protectedRoutes, allowedTo('Company_HR', 'user'), getJobsWithCompanyInfo)
    .get('/getJobsForCompany', protectedRoutes, allowedTo('Company_HR', 'user'), getJobsForCompany)
    .get('/getfilteredJobs', protectedRoutes, allowedTo('Company_HR', 'user'), getFilteredJobs)
    .post('/applyForJob', protectedRoutes, allowedTo('user'), applyForJob)
export default jobRouter