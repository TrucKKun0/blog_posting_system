 const logger = require('../utils/logger');
const PostReference = require('../models/postReferenceModel');

const Fuse = require("fuse.js");

const searchPosts = async (req, res) => {
    logger.info(`Search request received with query: ${req.query.q}`);

    try {
        const { q = "", sortBy } = req.query;
        const trimmedQuery = q.trim();

        if (!trimmedQuery) {
            return res.status(400).json({ message: "Search query is required" });
        }

        // ✅ Fetch limited data (important for performance)
        const posts = await PostReference.find().limit(200);

        // ✅ Fuse config (fuzzy search)
        const fuse = new Fuse(posts, {
            keys: ["title", "content"],
            threshold: 0.4, // lower = strict, higher = more fuzzy
        });

        const fuseResults = fuse.search(trimmedQuery);

        // Extract actual documents
        let results = fuseResults.map(r => r.item);

        // ✅ Apply sorting ONLY if requested
        if (sortBy === "likes") {
            results.sort((a, b) => b.likes - a.likes);
        } 
        else if (sortBy === "recent") {
            results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } 
        else if (sortBy === "popular_recent") {
            results.sort((a, b) => {
                if (b.likes !== a.likes) return b.likes - a.likes;
                return new Date(b.createdAt) - new Date(a.createdAt);
            });
        }

        res.json({
            success: true,
            message: "Search completed successfully",
            data: results
        });

    } catch (error) {
        logger.error(`Error during search: ${error.message}`);
        res.status(500).json({
            success: false,
            message: "An error occurred while searching for posts"
        });
    }
};
module.exports = {searchPosts};