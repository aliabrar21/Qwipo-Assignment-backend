import express from "express";
import Customer from "../models/Customer.js";

const router = express.Router();

/**
 * CREATE customer
 */
router.post("/", async (req, res) => {
    try {
        const { firstName, lastName, phone, addresses } = req.body;

        if (!firstName || !lastName || !phone || !addresses || addresses.length === 0) {
            return res.status(400).json({ message: "All fields required" });
        }

        const existing = await Customer.findOne({ phone });
        if (existing) return res.status(400).json({ message: "Phone number already exists" });

        const customer = new Customer({ firstName, lastName, phone, addresses });
        await customer.save();

        res.status(201).json({ message: "Customer created successfully", customer });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/**
 * READ all customers with filters + pagination
 */
router.get("/", async (req, res) => {
    try {
        const { city, state, pincode, page = 1, limit = 10 } = req.query;
        const filter = {};

        if (city) filter["addresses.city"] = city;
        if (state) filter["addresses.state"] = state;
        if (pincode) filter["addresses.pincode"] = pincode;

        const customers = await Customer.find(filter)
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        res.json(customers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/**
 * READ single customer by ID
 */
router.get("/:id", async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) return res.status(404).json({ message: "Customer not found" });
        res.json(customer);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/**
 * UPDATE customer
 */
router.put("/:id", async (req, res) => {
    try {
        const updated = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ message: "Customer not found" });
        res.json({ message: "Customer updated successfully", updated });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/**
 * DELETE customer
 */
router.delete("/:id", async (req, res) => {
    try {
        const deleted = await Customer.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Customer not found" });
        res.json({ message: "Customer deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/**
 * SEARCH multiple addresses
 */
router.get("/search/multiple-addresses", async (req, res) => {
    try {
        const customers = await Customer.find({ "addresses.1": { $exists: true } });
        res.json(customers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/**
 * SEARCH by city, state, or pincode
 */
router.get("/search/filter", async (req, res) => {
    try {
        const { city, state, pincode } = req.query;
        const filter = {};

        if (city) filter["addresses.city"] = city;
        if (state) filter["addresses.state"] = state;
        if (pincode) filter["addresses.pincode"] = pincode;

        const results = await Customer.find(filter);
        res.json(results);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
