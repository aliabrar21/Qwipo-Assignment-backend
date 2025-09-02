import mongoose from "mongoose";

// Address sub-schema
const addressSchema = new mongoose.Schema({
        street: { type: String, required: true },
        city:   { type: String, required: true },
        state:  { type: String, required: true },
        pincode:{ type: String, required: true }
});

// Customer schema
const customerSchema = new mongoose.Schema({
        firstName: { type: String, required: true, trim: true },
        lastName:  { type: String, required: true, trim: true },
        phone:     { type: String, required: true, unique: true },
        addresses: { type: [addressSchema], required: true }
}, { timestamps: true });

export default mongoose.model("Customer", customerSchema);
