const {Schema, model} = require("mongoose")

const companySchema = new Schema (
    {
        image: {
            type: String,
        },
        name: {
            type: String,
            required: true,
            unique: true
        },
        owner: {
            type: String,
        },
        about: {
            type: String,
        },
        address: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
        },
        email: {
            type: String,
        },
        url: {
            type: String,
        },
        creatorId: {
            type: Schema.Types.ObjectId, 
            ref: "User"
        },
    },
    {
        timeseries: true,
        timestamps: true,
    }
)

const Company = model("Company", companySchema)

module.exports = Company;