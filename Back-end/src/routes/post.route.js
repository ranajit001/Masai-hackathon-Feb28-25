import express from "express";
import Post from "../models/Post.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Create a new post (Text or Image)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { content, image } = req.body;
    const newPost = new Post({ userId: req.user.id, content, image });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("userId", "username") // Fetch user details
      .populate("comments.userId", "username") // Fetch comment authors
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Like / Unlike a post
router.put("/:postId/like", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const likeIndex = post.likes.indexOf(req.user.id);
    if (likeIndex === -1) {
      post.likes.push(req.user.id); // Like the post
    } else {
      post.likes.splice(likeIndex, 1); // Unlike the post
    }

    await post.save();
    res.json({ message: "Like status updated", likes: post.likes.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Add a comment to a post
router.post("/:postId/comment", authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const newComment = { userId: req.user.id, text };
    post.comments.push(newComment);
    await post.save();

    res.json({ message: "Comment added", comments: post.comments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get a single post by ID
router.get("/:postId", async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId)
      .populate("userId", "username")
      .populate("comments.userId", "username");
    if (!post) return res.status(404).json({ error: "Post not found" });

    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
