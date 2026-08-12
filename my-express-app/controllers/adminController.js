const db = require('../config/db');
const bcrypt = require('bcrypt');
exports.getDashboardStats = async (req, res) => {
    try {
        // Run all three count queries concurrently for faster performance
        const [usersCount, storesCount, ratingsCount] = await Promise.all([
            db.query('SELECT COUNT(*) FROM users'),
            db.query('SELECT COUNT(*) FROM stores'),
            db.query('SELECT COUNT(*) FROM ratings')
        ]);

        res.status(200).json({
            message: "Admin Dashboard Statistics fetched successfully",
            data: {
                total_users: parseInt(usersCount.rows[0].count),
                total_stores: parseInt(storesCount.rows[0].count),
                total_ratings: parseInt(ratingsCount.rows[0].count)
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error while fetching dashboard stats." });
    }
};


exports.getUsers = async (req, res) => {
    try {
        const { name, email, address, role, sortBy = 'name', order = 'ASC' } = req.query;
        
        // Allowed columns to prevent SQL injection
        const validSortColumns = ['name', 'email', 'address', 'role'];
        const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'name';
        const sortOrder = ['ASC', 'DESC'].includes(order.toUpperCase()) ? order.toUpperCase() : 'ASC';

        let query = `
            SELECT u.id, u.name, u.email, u.address, u.role, 
                   COALESCE(s_avg.avg_rating, 0) as owner_rating
            FROM users u
            LEFT JOIN stores s ON u.id = s.owner_id
            LEFT JOIN (
                SELECT store_id, ROUND(AVG(rating), 1) as avg_rating 
                FROM ratings GROUP BY store_id
            ) s_avg ON s.id = s_avg.store_id
            WHERE 1=1
        `;
        let params = [];
        let paramIndex = 1;

        if (name) {
            query += ` AND u.name ILIKE $${paramIndex++}`;
            params.push(`%${name}%`);
        }
        if (email) {
            query += ` AND u.email ILIKE $${paramIndex++}`;
            params.push(`%${email}%`);
        }
        if (address) {
            query += ` AND u.address ILIKE $${paramIndex++}`;
            params.push(`%${address}%`);
        }
        if (role) {
            query += ` AND u.role = $${paramIndex++}`;
            params.push(role);
        }

        query += ` ORDER BY u.${sortColumn} ${sortOrder}`;
        
        const result = await db.query(query, params);
        res.status(200).json({ success: true, data: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error while fetching users." });
    }
};



exports.addUserByAdmin = async (req, res) => {
    try {
        const { name, email, password, address, role } = req.body;

        // Validations from PDF
        if (!name || name.length < 20 || name.length > 60) {
            return res.status(400).json({ error: "Name must be between 20 and 60 characters." });
        }
        if (!address || address.length > 400) {
            return res.status(400).json({ error: "Address cannot exceed 400 characters." });
        }
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,16}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ error: "Password must be 8-16 chars with 1 uppercase and 1 special char." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await db.query(
            'INSERT INTO users (name, email, password_hash, address, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role',
            [name, email, hashedPassword, address, role || 'NORMAL_USER']
        );

        res.status(201).json({ message: "User added successfully!", user: newUser.rows[0] });
    } catch (err) {
        if (err.code === '23505') {
            return res.status(400).json({ error: "Email already exists." });
        }
        res.status(500).json({ error: "Server error while adding user." });
    }
};

