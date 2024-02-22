import mongoose from "mongoose";
import { jobModel } from "../../databases/models/job.model.js";
import { appError } from "../utils/appError.js";

// Check if the user is the owner of the job
export const jobOwner = async (req, res, next) => {
    const jobId = req.params.jobId;
    const existingJob = await jobModel.findById(jobId);

    if (!existingJob) {
        return next(new appError('Job not found', 404));
    }

    const userId = req.user._id;
    if (existingJob.addedBy.toString() !== new mongoose.Types.ObjectId(userId).toString()) {
        return next(new appError('Unauthorized: Only the owner can update the job', 403));
    }

    next();
};
