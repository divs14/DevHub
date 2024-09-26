const express=require("express");
const router=express.Router();
const blogControllers=require("../controllers/blog-controller");

router.route("/posts").get(blogControllers.posts);
router.route("/myPosts").get(blogControllers.myPosts);
router.route("/create").post(blogControllers.create);
router.route("/update").post(blogControllers.update);
router.route("/delete").post(blogControllers.remove);
router.route("/like").post(blogControllers.like);
router.route("/dislike").post(blogControllers.dislike);
router.route("/addComment").post(blogControllers.addComment);
router.route("/search").get(blogControllers.searchBlogs);
router.route('/:id').get(blogControllers.getBlogById);

module.exports=router;