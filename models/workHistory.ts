/* eslint-disable */
import mongoose, { Document, Model } from "mongoose";

export interface IWorkHistory extends Document {
    _id: mongoose.Schema.Types.ObjectId;
    jobID: mongoose.Schema.Types.ObjectId;
    review:
    {
        status: boolean;
        rating: number;
        comment: string;
    }

}

const workHistorySchema = new mongoose.Schema<IWorkHistory>({
    jobID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "JobPost",
        required: true,
    },
    review: {
        status: {
            type: Boolean,
            enum: [true, false],
            default: false,
            required: true,
        },
        rating: {
            type: Number,
            required: true,
        },
        comment: {
            type: String,
            required: true,
        }
    }

}, { timestamps: true });
const WorkHistory = (mongoose.models.workHistory as Model<IWorkHistory>) || mongoose.model<IWorkHistory>("WorkHistory", workHistorySchema);
export default WorkHistory;


