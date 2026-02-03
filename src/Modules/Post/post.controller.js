import { User, Post, Comment, sequelize } from "../../DB/connections.js";

// 1. Create a new post (Requirement: new instance and save)
export const createPost = async (req, res) => {
    try {
        const post = new Post(req.body); 
        await post.save();
        res.status(201).json({ message: "Post created successfully." });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 2. Delete post (Requirement: only owner can delete, uses soft-delete)
export const deletePost = async (req, res) => {
    const { postId } = req.params;
    const { userId } = req.body; // Assuming userId is sent in body for ownership check

    const post = await Post.findByPk(postId);
    if (!post) return res.status(404).json({ message: "Post not found." });

    if (post.userId !== userId) {
        return res.status(403).json({ message: "You are not authorized to delete this post" });
    }

    await post.destroy(); // This performs a soft-delete because paranoid is true
    res.json({ message: "Post deleted successfully." });
};

// 3. Get posts with User and Comment details
export const getPostsWithDetails = async (req, res) => {
    const posts = await Post.findAll({
        attributes: ['id', 'title'],
        include: [
            { model: User, attributes: ['id', 'name'] },
            { model: Comment, attributes: ['id', 'content'] }
        ]
    });
    res.json(posts);
};

// 4. Get posts and count comments
export const getPostCommentCount = async (req, res) => {
    const posts = await Post.findAll({
        attributes: [
            'id', 
            'title', 
            [sequelize.fn('COUNT', sequelize.col('Comments.id')), 'commentCount']
        ],
        include: [{ 
            model: Comment, 
            attributes: [] 
        }],
        group: ['Post.id']
    });
    res.json(posts);
};