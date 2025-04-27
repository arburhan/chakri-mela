/* eslint-disable */
import mongoose, { Document, Model, Schema } from "mongoose";

// Interface for salary range
interface ISalaryRange {
    startRange: number;
    endRange: number;
}

// Interface for job post document
export interface IJobPost extends Document {
    _id: string;
    jobTitle: string;
    jobDescription: string;
    jobType: string;
    workingHour: number;
    salaryRange: ISalaryRange;
    jobLevel: string[];
    jobCategory: string;
    skills: string[];
    status: string;
    jobLocation: {
        city: string;
        state: string;
        country: string;
    };
    posterID: mongoose.Schema.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

// Schema for job post
const JobPostSchema: Schema = new Schema({
    jobTitle: {
        type: String,
        required: true
    },
    jobDescription: {
        type: String,
        required: true
    },
    jobType: {
        type: String,
        required: true
    },
    workingHour: {
        type: Number,
        required: true
    },
    salaryRange: {
        startRange: {
            type: Number,
            required: true
        },
        endRange: {
            type: Number,
            required: true
        }
    },
    jobLevel: [{
        type: String,
        required: true
    }],
    jobCategory: {
        type: String,
        required: true
    },
    skills: [{
        type: String,
        required: true
    }],
    status: {
        type: String,
        enum: ['active', 'completed', 'expired'],
        default: 'active',
        required: true
    },
    jobLocation: {
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        }
    },
    posterID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
}, {
    timestamps: true
});

JobPostSchema.pre('save', function (next) {
    // Perform any pre-save operations here if needed
    next();
});

const IJobPost = (mongoose.models.JobPost as Model<IJobPost>) || mongoose.model<IJobPost>("JobPost", JobPostSchema);

export default IJobPost;