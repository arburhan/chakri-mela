import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
    _id: string;
    name: string;
    email: string;
    password: string;
    role: string;
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
const User = (mongoose.models.User as Model<IUser>) || mongoose.model<IUser>("User", userSchema);

export default User;