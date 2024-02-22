import mongoose, { Schema } from "mongoose";

const jobSchema = new mongoose.Schema({
    jobTitle: {
        type: String,
        unique: true,
        required: [true, 'jobTitle is required'],
        minLength: [2, 'too short jobTitle'],
        trim: true,
    },
    jobLocation: {
        type: String,
        required: [true, 'jobLocation is required'],
        trim: true,
        enum: ['onsite', 'remotely', 'hybrid']
    },
    workingTime: {
        type: String,
        required: [true, 'workingTime is required'],
        enum: ['Full-time', 'Part-time'],
        default: "Full-time"
    },
    seniorityLevel: {
        type: String,
        required: [true, 'industry is required'],
        minLength: [2, 'too short industry name'],
        trim: true,
        enum: ["Junior", "Mid-Level", "Senior", "Team-Lead", "CTO"]
    },
    jobDescription: {
        type: String,
        required: [true, 'address is required'],
        minLength: [2, 'too short address'],
        maxLength: [1000, 'too long description'],
        trim: true,
    },
    technicalSkills: {
        type: [String],
        required: [true, 'technicalSkills is required'],
    },
    softSkills: {
        type: [String],
        unique: true,
        required: [true, 'softSkills is required'],
        trim: true,
    },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'company',
    }
}, { timestamps: true })

export const jobModel = mongoose.model('job', jobSchema);