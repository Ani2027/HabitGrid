import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
        trim: true,
    },

    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        lowercase: true,
    },

    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"],
        select: false,
    },
},

    {
        timestamps: true,
    }
);

// There is error in using next() -- coz it is not defined in the function, so we can use function keyword instead of arrow function to define the function, so that we can use this keyword to access the current document and next() to pass control to the next middleware function in the stack.

// userSchema.pre("save", async function (next) {
//     try {
//         if (!this.isModified("password")) return next();
//         const salt = await bcrypt.genSalt(10);
//         this.password = await bcrypt.hash(this.password, salt);
//         next();
//     } catch (error) {
//         console.error(error);
//         next(error);
//     }
// });

// This schema method is used to hash the password before saving the user to database.
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Now we will create our own scema method to compare the password with the hashed password in the database.
userSchema.methods.checkPassword = async function (password){
    return await bcrypt.compare(password, this.password);
}

const User = mongoose.model("User", userSchema);

export default User;