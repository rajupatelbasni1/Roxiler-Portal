const db = require('../config/db');

exports.submitRating = async (req, res) => {
    try {
        const { store_id, rating } = req.body;
        const user_id = req.user.id; 

        // Validation for rating (1 to 5) as per requirements
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ error: "Rating must be an integer between 1 and 5." });
        }

        if (!store_id) {
            return res.status(400).json({ error: "Store ID is required." });
        }

        // UPSERT Query: Insert if new, Update if exists
        const ratingQuery = `
            INSERT INTO ratings (user_id, store_id, rating) 
            VALUES ($1, $2, $3) 
            ON CONFLICT (user_id, store_id) 
            DO UPDATE SET rating = EXCLUDED.rating, updated_at = CURRENT_TIMESTAMP
            RETURNING *;
        `;

        const newRating = await db.query(ratingQuery, [user_id, store_id, rating]);

        res.status(200).json({
            message: "Rating submitted/modified successfully!",
            data: newRating.rows[0]
        });

    } catch (err) {
        console.error(err);
        
        // Handle case where store_id doesn't exist in stores table
        if (err.code === '23503') { 
            return res.status(404).json({ error: "Store not found." });
        }

        res.status(500).json({ error: "Server error while submitting rating." });
    }
};