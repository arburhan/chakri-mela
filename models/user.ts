
import mongoose, { Schema, Document, Model } from "mongoose";

// Interface for User document
interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    logger: () => void;
}

// Interface for User methods
interface IUserMethods {
    logger(): void;
}

// Create a new Model type that knows about IUserMethods
type UserModel = Model<IUser, {}, IUserMethods>;

const userSchema = new Schema<IUser, UserModel>(
    {
        name: {
            type: String,
            required: [true, "User name must required"],
            trim: true,
            minLength: [3, "Name must be at least 3 characters."],
            maxLength: [100, "Name is too large"],
        },
        email: {
            type: String,
            required: [true, "Email required"],
            unique: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
        },
    },
    {
        timestamps: true,
    }
);

// Add method to the schema
userSchema.methods.logger = function (): void {
    console.log(`Data saved for ${this.name}`);
};

// Export the model with proper typing
const User = (mongoose.models.User || mongoose.model<IUser, UserModel>("User", userSchema)) as UserModel;

export default User;