import { User, Post, Comment } from "../../DB/connections.js";
import { Op } from "sequelize";

// 1. Create a bulk of Comments 
export const bulkCreateComments = async (req, res) => {
    try {
        await Comment.bulkCreate(req.body); // req.body should be an array
        res.status(201).json({ message: "comments created." });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 2. Update specific comment by ID (Only owner can update) 
export const updateComment = async (req, res) => {
    const { commentId } = req.params;
    const { userId, content } = req.body;

    const comment = await Comment.findByPk(commentId);
    if (!comment) return res.status(404).json({ message: "comment not found." });

    if (comment.userId !== userId) {
        return res.status(403).json({ message: "You are not authorized to update this comment" });
    }

    await comment.update({ content });
    res.json({ message: "Comment updated." });
};

// 3. Find or Create a comment 
export const findOrCreateComment = async (req, res) => {
    const { postId, userId, content } = req.body;
    const [comment, created] = await Comment.findOrCreate({
        where: { postId, userId, content },
        defaults: { postId, userId, content }
    });
    res.json({ comment, created });
};

// 4. Search comments by word and count matches 
export const searchComments = async (req, res) => {
    const { word } = req.query;
    const { count, rows } = await Comment.findAndCountAll({
        where: {
            content: { [Op.like]: `%${word}%` }
        }
    });
    
    if (count === 0) return res.status(404).json({ message: "no comments found." });
    res.json({ count, comments: rows });
};

// 5. Retrieve 3 most recent comments for a post 
export const getRecentComments = async (req, res) => {
    const { postId } = req.params;
    const comments = await Comment.findAll({
        where: { postId },
        order: [['createdAt', 'DESC']],
        limit: 3
    });
    res.json(comments);
};

// 6. Get Comment by PK with User and Post Info 
export const getCommentDetails = async (req, res) => {
    const { id } = req.params;
    const comment = await Comment.findByPk(id, {
        include: [
            { model: User, attributes: ['name', 'email'] },
            { model: Post, attributes: ['title'] }
        ]
    });
    if (!comment) return res.status(404).json({ message: "no comment found" });
    res.json(comment);
};