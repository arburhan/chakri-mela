/* eslint-disable */
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProposal extends Document {
    _id: string;
    coverLetter: string;
    bidAmount: number;
    jobID: mongoose.Schema.Types.ObjectId;
    seekerID: mongoose.Schema.Types.ObjectId;
    status: string; // e.g., "pending", "shortlisted", "rejected"
    createdAt: Date;
    updatedAt: Date;
}

const ApplySchema: Schema = new Schema(
    {
        coverLetter: { type: String, required: true },
        bidAmount: { type: Number, required: true },
        jobID: { type: mongoose.Schema.Types.ObjectId, ref: "JobPost", required: true },
        seekerID: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        status: { type: String, enum: ["pending", "shortlisted", "rejected"], default: "pending" },
    },
    { timestamps: true }
);

const ProposalSchm = (mongoose.models.ProposalSchm as Model<IProposal>) || mongoose.model<IProposal>("ProposalSchm", ApplySchema);

export default ProposalSchm;
