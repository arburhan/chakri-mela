/* eslint-disable */
import mongoose, { Document, Model, Schema } from "mongoose";

// Interface for salary range
interface ISalaryRange {
    startRange: number;
    endRange: number;
}

// Interface for proposal
export interface IProposal {
    _id: mongoose.Types.ObjectId;
    coverLetter: string;
    bidAmount: number;
    jobID: mongoose.Types.ObjectId;
    seekerID: mongoose.Types.ObjectId;
    status: string;
    hiredAt: Date | null;
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
    isFeatured: boolean;
    isUrgent: boolean;
    proposals: IProposal[];
    posterID: mongoose.Schema.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
    isReviewed: boolean;
}

// Schema for job post
const JobPostSchema: Schema = new Schema({
    jobTitle: {
        type: String,
        required: true,
    },
    jobDescription: {
        type: String,
        required: true,
    },
    jobType: {
        type: String,
        required: true,
    },
    workingHour: {
        type: Number,
        required: true,
    },
    salaryRange: {
        startRange: {
            type: Number,
            required: true,
        },
        endRange: {
            type: Number,
            required: true,
        },
    },
    jobLevel: [
        {
            type: String,
            required: true,
        },
    ],
    jobCategory: {
        type: String,
        required: true,
    },
    skills: [
        {
            type: String,
            required: true,
        },
    ],
    status: {
        type: String,
        enum: ["active", "completed", "expired"],
        default: "active",
        required: true,
    },
    jobLocation: {
        city: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: true,
        },
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
    isUrgent: {
        type: Boolean,
        default: false,
    },
    proposals: [
        {
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                default: () => new mongoose.Types.ObjectId(), // Automatically generate unique ID
            },
            coverLetter: {
                type: String,
                required: true,
            },
            bidAmount: {
                type: Number,
                required: true,
            },
            jobID: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "JobPost",
                required: true,
            },
            seekerID: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
            status: {
                type: String,
                enum: ["pending", "accepted", "rejected"],
                default: "pending",
                required: true,
            },
            hiredAt: {
                type: Date,
                default: null,
            },
        },
    ],
    posterID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    isReviewed: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

JobPostSchema.pre("save", function (next) {
    // Perform any pre-save operations here if needed
    next();
});

const JobPost = mongoose.models?.JobPost || mongoose.model<IJobPost>("JobPost", JobPostSchema);

export default JobPost;