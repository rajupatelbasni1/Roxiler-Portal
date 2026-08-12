const db = require('../config/db');

exports.getOwnerDashboard = async (req, res) => {
    try {
        const owner_id = req.user.id;
        const ownerEmail = req.user.email; 

        // User ki email nikalna
        const userResult = await db.query('SELECT email FROM users WHERE id = $1', [owner_id]);
        const email = userResult.rows[0].email;


        const storeResult = await db.query(
            'SELECT id, name FROM stores WHERE owner_id = $1 OR email = $2', 
            [owner_id, email]
        );
        
        if (storeResult.rows.length === 0) {
            return res.status(404).json({ error: "No store found linked with this owner's email." });
        }
        
        const store = storeResult.rows[0];

    
        await db.query('UPDATE stores SET owner_id = $1 WHERE id = $2 AND owner_id IS NULL', [owner_id, store.id]);

        // 2. Get the average rating of this store
        const avgResult = await db.query(
            'SELECT COALESCE(ROUND(AVG(rating), 1), 0) AS average_rating FROM ratings WHERE store_id = $1', 
            [store.id]
        );

        // 3. Get the list of users who submitted ratings for this store
        const ratersResult = await db.query(`
            SELECT u.name, u.email, r.rating, r.updated_at as rated_on
            FROM ratings r
            JOIN users u ON r.user_id = u.id
            WHERE r.store_id = $1
            ORDER BY r.updated_at DESC
        `, [store.id]);

        res.status(200).json({
            message: "Store Owner Dashboard fetched successfully",
            store_info: {
                id: store.id,
                name: store.name,
                average_rating: parseFloat(avgResult.rows[0].average_rating)
            },
            raters: ratersResult.rows
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error while fetching owner dashboard." });
    }
};