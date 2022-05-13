const {Schema, model} = require("mongoose")

const userSchema = new Schema (
    {
        username: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            // required: true,
        },
        firstName: {
            type: String,
            // required: true,
        },
        lastName: {
            type: String,
            // required: true,
        },
        dateOfBirth: {
            type: String,
        },
        city: {
            type: String,
        },
        state: {
            type: String,
        },
        isAdmin: {
            type: Boolean
        }
    },
    {
        timeseries: true,
        timestamps: true,
    }
)

const User = model("User", userSchema)

module.exports = User;