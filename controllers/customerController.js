import Customer from "../models/Customer.js";
import Address from "../models/Address.js";

// Create Customer
export const createCustomer = async (req, res) => {
    try {
        const customer = new Customer(req.body);
        await customer.save();
        res.status(201).json({ message: "Customer created successfully", customer });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get All Customers with Pagination & Search
export const getCustomers = async (req, res) => {
    try {
        const { page = 1, limit = 5, city, state, pincode } = req.query;
        let filter = {};
        if (city) filter.city = city;
        if (state) filter.state = state;
        if (pincode) filter.pincode = pincode;

        const customers = await Customer.find(filter)
            .populate("addresses")
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const count = await Customer.countDocuments(filter);

        res.json({
            customers,
            totalPages: Math.ceil(count / limit),
            currentPage: Number(page),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Single Customer
export const getCustomerById = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id).populate("addresses");
        if (!customer) return res.status(404).json({ message: "Customer not found" });
        res.json(customer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Customer
export const updateCustomer = async (req, res) => {
    try {
        const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        res.json({ message: "Customer updated", customer });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete Customer
export const deleteCustomer = async (req, res) => {
    try {
        await Customer.findByIdAndDelete(req.params.id);
        res.json({ message: "Customer deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add Address
export const addAddress = async (req, res) => {
    try {
        const { customerId, addressLine, city, state, pincode } = req.body;
        const address = new Address({ customerId, addressLine, city, state, pincode });
        await address.save();
        await Customer.findByIdAndUpdate(customerId, { $push: { addresses: address._id } });
        res.status(201).json({ message: "Address added", address });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
