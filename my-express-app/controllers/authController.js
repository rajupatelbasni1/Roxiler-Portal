const bcrypt = require('bcrypt');
const db = require('../config/db');

const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
    try {
        const { name, email, password, address, role } = req.body;

        // 1. Validations (As per challenge PDF)
        if (name.length < 20 || name.length > 60) {
            return res.status(400).json({ error: "Name must be between 20 and 60 characters." });
        }
        if (address && address.length > 400) {
            return res.status(400).json({ error: "Address cannot exceed 400 characters." });
        }
        
        // Password must be 8-16 chars, 1 uppercase, 1 special character
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ error: "Password must be 8-16 characters, include one uppercase letter and one special character." });
        }

        // Email validation format basic check
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email format." });
        }

        // 2. Check if user already exists
        const userExists = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ error: "Email is already registered." });
        }

        // 3. Hash the Password securely
        const saltRounds = 10;
        const password_hash = await bcrypt.hash(password, saltRounds);

        // 4. Insert New User into PostgreSQL
        const newUser = await db.query(
            'INSERT INTO users (name, email, password_hash, address, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role',
            [name, email, password_hash, address, role]
        );

        res.status(201).json({ 
            message: "User registered successfully!", 
            user: newUser.rows[0] 
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error during signup" });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Find the user by email
        const userResult = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userResult.rows.length === 0) {
            return res.status(401).json({ error: "Invalid email or password." });
        }
        
        const user = userResult.rows[0];

        // 2. Compare the entered password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid email or password." });
        }

        // 3. Generate a JWT Token
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' } // Token expires in 1 day
        );

        // 4. Send the token and user details to the frontend
        res.status(200).json({
            message: "Login successful",
            token: token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error during login" });
    }
};


exports.updatePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const userId = req.user.id;

       
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,16}$/;
        if (!passwordRegex.test(newPassword)) {
            return res.status(400).json({ 
                error: "Password must be 8-16 characters long, include at least one uppercase letter and one special character." 
            });
        }

        const userResult = await db.query('SELECT password_hash FROM users WHERE id = $1', [userId]);
        const user = userResult.rows[0];

        const isMatch = await bcrypt.compare(oldPassword, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ error: "Incorrect old password." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await db.query('UPDATE users SET password_hash = $1 WHERE id = $2', [hashedPassword, userId]);

        res.status(200).json({ message: "Password updated successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error while updating password." });
    }
};