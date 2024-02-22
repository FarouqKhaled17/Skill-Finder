import mongoose from "mongoose"
import { userModel } from "../../../databases/models/user.model.js"
import { catchError } from "../../middleware/catchError.js"
import { appError } from "../../utils/appError.js"
import { jobModel } from "../../../databases/models/job.model.js"
import multer from 'multer';
import cloudinaryPkg from 'cloudinary';
const cloudinary = cloudinaryPkg.v2;
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { applicationModel } from "../../../databases/models/application.model.js"
import { companyModel } from "../../../databases/models/company.model.js"



//! add Job
const addJob = catchError(async (req, res, next) => {
    let user = new jobModel(req.body)
    await user.save()
    res.status(201).json({ message: "Job Created Successfully" })
})


//* Update Job  
const updateJob = catchError(async (req, res, next) => {
    const jobId = req.params.jobId;
    const existingJob = await jobModel.findById(jobId);
    if (!existingJob) {
        return next(new appError('Job not found', 404));
    }
    // Update only the provided fields
    const allowedFields = ['jobTitle', 'jobLocation', 'workingTime', 'seniorityLevel', 'jobDescription', 'technicalSkills', 'softSkills'];
    allowedFields.forEach((field) => {
        if (req.body[field] !== undefined) {
            existingJob[field] = req.body[field];
        }
    });
    // Save the updated job
    const updatedJob = await existingJob.save();
    res.status(200).json({ message: 'Job updated successfully', job: updatedJob });
});



//! Delete Company
const deleteJob = catchError(async (req, res, next) => {
    let company = await jobModel.deleteOne()
    if (company) {
        res.status(200).json({ message: "Job Deleted Successfully" })
    }
    else {
        return next(new appError('Job not found', 404))
    }
})

//? Get all Jobs with their company’s information.
const getJobsWithCompanyInfo = catchError(async (req, res, next) => {
    const jobs = await jobModel.find().populate({
        path: 'addedBy',
        select: 'companyName description industry companyEmail'

    });
    if (jobs)
        return res.status(200).json({ message: 'Jobs fetched successfully', jobs });
    return next(new appError('Error fetching jobs', 500));
});

//* Get all Jobs for a specific company.
const getJobsForCompany = catchError(async (req, res, next) => {
     const companyName = req.body.companyName;

    // Validate if companyName is a valid ObjectId
    if (!mongoose.isValidObjectId(companyName)) {
        return next(new appError('Invalid ObjectId for company', 400));
    }

    const jobs = await jobModel.find({ addedBy: companyName });

    if (jobs)
        return res.status(200).json({ message: 'Jobs fetched successfully', jobs });

    return next(new appError('Error fetching jobs', 500));
})


//! Filter
const getFilteredJobs = catchError(async (req, res, next) => {
    // Extract filter parameters from the request query
    const { workingTime, jobLocation, seniorityLevel, jobTitle, technicalSkills } = req.query;
    // Build the filter object based on the provided parameters
    const filter = {};
    if (workingTime) filter.workingTime = workingTime;
    if (jobLocation) filter.jobLocation = jobLocation;
    if (seniorityLevel) filter.seniorityLevel = seniorityLevel;
    if (jobTitle) filter.jobTitle = { $regex: new RegExp(jobTitle, 'i') }; // Case-insensitive search
    if (technicalSkills) filter.technicalSkills = { $in: technicalSkills.split(',') }; // Assuming technicalSkills is an array

    // Query the database with the constructed filter
    const jobs = await jobModel.find(filter);

    res.status(200).json({ message: 'Jobs fetched successfully', jobs });
});

//! Apply For A Job
// Configure Cloudinary
cloudinary.config({
    cloud_name: 'do4mx3b2e',
    api_key: '258481514793293',
    api_secret: '8gYpq8WieeJuQUnEZC3q3mNKg3o',
});
// Configure multer storage for Cloudinary
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'resumes', // Change this folder to suit your needs
        allowed_formats: ['pdf'],
        transformation: [{ width: 500, height: 500, crop: 'limit' }],
    },
});
const upload = multer({ storage });

// Apply for a job
const applyForJob = catchError(async (req, res, next) => {
    // Extract required information from the request
    const { jobId,companyId, userTechSkills, userSoftSkills } = req.body;
    const userId = req.user._id;


    // Check if the user has already applied for the job
    const existingApplication = await applicationModel.findOne({ jobId, userId });
    if (existingApplication) {
        return next(new appError('You have already applied for this job', 400));
    }

    // Assuming you've uploaded the PDF file to Cloudinary and obtained the URL
    const resumeUrl = 'https://collection.cloudinary.com/do4mx3b2e/2919d3521c048edfa25e80df464f900a';

    // Save application to the database
    const application = new applicationModel({
        jobId,
        companyId,
        userId,
        userTechSkills,
        userSoftSkills,
        userResume: resumeUrl,
    });

    await application.save();

    res.status(201).json({ message: 'Application submitted successfully' });
});



export {
    addJob,
    updateJob,
    deleteJob,
    getJobsWithCompanyInfo,
    getJobsForCompany,
    getFilteredJobs,
    applyForJob
}