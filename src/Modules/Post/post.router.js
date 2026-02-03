import { Router } from "express";
import * as postController from "./post.controller.js";

const router = Router();

router.post("/", postController.createPost);
router.delete("/:postId", postController.deletePost);
router.get("/details", postController.getPostsWithDetails);
router.get("/comment-count", postController.getPostCommentCount);

export default router;