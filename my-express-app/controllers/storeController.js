const db = require('../config/db');

exports.addStore = async (req, res) => {
    try {
        const { name, email, address } = req.body;

        // Basic validation
        if (!name || !email || !address) {
            return res.status(400).json({ error: "Name, email, and address are required." });
        }

        // Automatic Owner Assignment: Check if a user with this store email & role 'STORE_OWNER' exists
        const userCheck = await db.query(
            "SELECT id FROM users WHERE email = $1 AND role = 'STORE_OWNER'", 
            [email]
        );

        let owner_id = null;
        if (userCheck.rows.length > 0) {
            owner_id = userCheck.rows[0].id; // Automatically link if owner account exists with same email
        }

        // Insert into database automatically without needing manual ID
        const newStore = await db.query(
            'INSERT INTO stores (name, email, address, owner_id) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, email, address, owner_id]
        );

        res.status(201).json({
            message: "Store added successfully!",
            store: newStore.rows[0]
        });

    } catch (err) {
        console.error(err);
        if (err.code === '23505') {
            return res.status(400).json({ error: "A store with this email already exists." });
        }
        res.status(500).json({ error: "Server error while adding store." });
    }
};

exports.getStores = async (req, res) => {
    try {
        const user_id = req.user.id;
        
        // Search aur Sorting parameters URL se nikalna
        const search = req.query.search || '';
        const sortBy = req.query.sortBy || 'name'; 
        const order = (req.query.order || 'ASC').toUpperCase();

        // SQL Injection se bachne ke liye valid columns check karna
        const validSortColumns = ['name', 'address', 'overall_rating'];
        const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'name';
        const sortOrder = ['ASC', 'DESC'].includes(order) ? order : 'ASC';

        const searchTerm = `%${search}%`;

        // Updated Query with Email included as required by specifications
        const query = `
            SELECT 
                s.id AS store_id,
                s.name,
                s.email,
                s.address,
                COALESCE(ROUND(AVG(r.rating), 1), 0) AS overall_rating,
                (SELECT rating FROM ratings WHERE store_id = s.id AND user_id = $1) AS user_submitted_rating
            FROM stores s
            LEFT JOIN ratings r ON s.id = r.store_id
            WHERE s.name ILIKE $2 OR s.address ILIKE $2
            GROUP BY s.id, s.name, s.email, s.address
            ORDER BY ${sortColumn} ${sortOrder};
        `;

        const stores = await db.query(query, [user_id, searchTerm]);

        res.status(200).json({
            message: "Stores fetched successfully",
            data: stores.rows
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error while fetching stores." });
    }
};