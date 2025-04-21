/* eslint-disable */
import mongoose, { Document, Model, Schema } from "mongoose";

// Interface for salary range
interface ISalaryRange {
    startRange: number;
    endRange: number;
}

// Interface for job post document
export interface IJobPost extends Document {
    jobTitle: string;
    jobDescription: string;
    jobType: string;
    workingHour: number;
    salaryRange: ISalaryRange;
    jobLevel: string[];
    skills: string[];
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
    skills: [{
        type: String,
        required: true
    }]
}, {
    timestamps: true
});

JobPostSchema.pre('save', function (next) {
    // Perform any pre-save operations here if needed
    next();
}
);


const IJobPost = (mongoose.models.JobPost as Model<IJobPost>) || mongoose.model<IJobPost>("JobPost", JobPostSchema);

export default IJobPost;