import ExcelJS from 'exceljs';
import mongoose from "mongoose"
import { companyModel } from "../../../databases/models/company.model.js"
import { userModel } from "../../../databases/models/user.model.js"
import { catchError } from "../../middleware/catchError.js"
import { appError } from "../../utils/appError.js"
import { jobModel } from "../../../databases/models/job.model.js"
import { applicationModel } from "../../../databases/models/application.model.js"

//! addCompany
const addCompany = catchError(async (req, res, next) => {
    let user = new companyModel(req.body)
    await user.save()
    res.status(201).json({ message: "Company Created Successfully" })
})


//* Update Company  
const updateCompany = catchError(async (req, res, next) => {
    const companyId = req.params.companyId;
    const existingCompany = await companyModel.findById(companyId);
    // Update only the provided fields
    const allowedFields = ['companyName', 'description', 'industry', 'address', 'numberOfEmployees', 'companyEmail'];

    allowedFields.forEach((field) => {
        if (req.body[field]) {
            existingCompany[field] = req.body[field];
        }
    });
    // Save the updated company
    const updatedCompany = await existingCompany.save();

    res.status(200).json({ message: 'Company updated successfully', company: updatedCompany });
});


//! Delete Company
const deleteCompany = catchError(async (req, res, next) => {
    let company = await companyModel.deleteOne()
    if (company) {
        res.status(200).json({ message: "Company Deleted Successfully" })
    }
    else {
        return next(new appError('Company not found', 404))
    }
})



//? Search for a company with a name 
const searchForCompany = catchError(async (req, res, next) => {
    let company = await companyModel.find({ companyName: req.body.companyName })
    if (company) {
        res.status(200).json({ message: "Company found", company })
    }
    else {
        return next(new appError('Company not found', 404))
    }
})



//! Get company data
const getCompany = catchError(async (req, res, next) => {
    const companyId = req.params.companyId;
    // Validate if companyId is a valid ObjectId
    if (!mongoose.isValidObjectId(companyId)) {
        return next(new appError('Invalid ObjectId for company', 400));
    }
    // Find the company by its ObjectId
    const company = await companyModel.findById(companyId);
    if (!company) {
        return next(new appError('Company not found', 404));
    }
    // Find all jobs related to this company
    const jobs = await jobModel.find({ 'addedBy': companyId });
    res.status(200).json({
        message: 'Company data fetched successfully',
        company,
        jobs,
    });
});




//? Get all applications for specific Jobs
const getApplicationsForJobs = catchError(async (req, res, next) => {
    const jobId = req.params.jobId;
    // Validate if jobId is a valid ObjectId
    if (!mongoose.isValidObjectId(jobId)) {
        return next(new appError('Invalid ObjectId for job', 400));
    }
    // Find the job by its ObjectId
    const job = await jobModel.findById(jobId);
    if (!job) {
        return next(new appError('Job not found', 404));
    }
    // Find all applications for the specified job
    const applications = await applicationModel.find({ 'jobId': jobId }).populate({
        path: 'userId',
        select: 'userTechSkills userSoftSkills'
    }); // Adjust fields as needed
    res.status(200).json({
        message: 'Applications fetched successfully',
        applications,
    });
});









export {
    addCompany,
    updateCompany,
    deleteCompany,
    getCompany,
    searchForCompany,
    getApplicationsForJobs,
}