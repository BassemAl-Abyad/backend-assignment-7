
import { User } from "../../DB/connections.js";

export const signup = async (req, res) => {
    try {
        const { email } = req.body;
        const exists = await User.findOne({ where: { email } });
        if (exists) return res.status(400).json({ message: "Email already exists." });

        const user = User.build(req.body); // Requirement: build and save
        await user.save();
        res.status(201).json({ message: "User added successfully." });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const upsertUser = async (req, res) => {
    const { id } = req.params;
    try {
        let user = await User.findByPk(id);
        if (user) {
            // User exists, update it skipping validation
            await user.update(req.body, { validate: false });
            return res.json({ message: "User updated successfully (validation skipped)" });
        } else {
            // User does not exist, create it with the specified ID, skipping validation
            const newUser = await User.create({ ...req.body, id }, { validate: false });
            return res.status(201).json({ message: "User created successfully (validation skipped)", user: newUser });
        }
    } catch (error) {
        res.status(500).json({ message: "An error occurred", error: error.message });
    }
};

export const getByEmail = async (req, res) => {
    const user = await User.findOne({ where: { email: req.query.email } });
    user ? res.json({ user }) : res.status(404).json({ message: "no user found" });
};

export const getByPk = async (req, res) => {
    const { id } = req.params;
    const user = await User.findByPk(id, {
        attributes: { exclude: ['role'] } 
    });
    
    // The assignment requires "no user found" message if not found
    if (!user) {
        return res.status(404).json({ message: "no user found" });
    }
    res.status(200).json(user);
};
