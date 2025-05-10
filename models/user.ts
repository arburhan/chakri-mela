/* eslint-disable */
import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
    _id: string;
    name: string;
    email: string;
    password: string;
    role: string;
    gender: string;
    mobileNumber: string;
    currentLocation: {
        city: string;
        state: string;
        country: string;
    };
    dateOfBirth: Date;
    nidNumber: Number;
    categories: string[];
    skills: string[];
    appliedJobs: mongoose.Schema.Types.ObjectId[];
    workHistory: mongoose.Schema.Types.ObjectId[];
    matchPassword(enteredPassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
    name: {
        type: String,
        required: [true, "Please provide a name"],
    },
    email: {
        type: String,
        required: [true, "Please provide an email"],
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        select: false, // This will exclude the password by default
    },
    role: {
        type: String,
        enum: ["admin", "poster", "seeker"],
    },
    gender: {
        type: String,
        enum: ["male", "female", "other"],
    },
    mobileNumber: {
        type: String,
        validate: {
            validator: function (v: string) {
                // Basic validation for phone number format
                return /^[+]?[\d\s-]+$/.test(v);
            },
            message: (props: any) => `${props.value} is not a valid phone number!`
        }
    },
    currentLocation: {
        city: {
            type: String,
        },
        state: {
            type: String,
        },
        country: {
            type: String,
        }
    },
    dateOfBirth: {
        type: Date,
    },
    nidNumber: {
        type: Number,
        unique: true,
    },
    categories: [{
        type: String,
    }],
    skills: [{
        type: String,
    }],
    appliedJobs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
    }],
    workHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "WorkHistory",
    }],
}, {
    timestamps: true,
});

// Hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error: any) {
        next(error);
    }
});

// Method to compare password
userSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
    try {
        return await bcrypt.compare(enteredPassword, this.password);
    } catch (error) {
        console.error("Error comparing passwords:", error);
        return false;
    }
};

// Delete old model if it exists to prevent OverwriteModelError
const User = mongoose.models?.User || mongoose.model<IUser>("User", userSchema);

export default User;