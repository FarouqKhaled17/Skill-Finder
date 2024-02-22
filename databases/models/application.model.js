import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'job',
        required: true
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'company',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    userTechSkills: {
        type: [String],
        required: [true, 'userTechSkills is required'],
    },
    userSoftSkills: {
        type: [String],
        required: [true, 'userSoftSkills is required'],
    },
    userResume: {
        type: String,
        required: [true, 'userResume is required'],
    },
}, { timestamps: true })

export const applicationModel = mongoose.model('application', applicationSchema);