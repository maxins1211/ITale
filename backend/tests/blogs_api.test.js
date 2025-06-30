const moogoose = require("mongoose");
const { test, after, beforeEach } = require("node:test");
const supertest = require("supertest");
const assert = require("node:assert");
const Blog = require("../models/blog");
const User = require("../models/user")
const helper = require("./test_helper");
const app = require("../app");
const jwt = require("jsonwebtoken")

const api = supertest(app);

beforeEach(async () => {
    await Blog.deleteMany({});
    await User.deleteMany({});
    const user = new User({ username: "testuser", passwordHash: "hashedpassword" });
    await user.save();
    const userForToken = { username: user.username, id: user._id };
    token = jwt.sign(userForToken, process.env.SECRET);
    await Blog.insertMany(helper.initialBlogs);
});

test("all blogs are returned as JSON", async () => {
    await api
        .get("/api/blogs")
        .expect(200)
        .expect("Content-Type", /application\/json/);
    const blogs = await helper.blogsInDb();
    assert.strictEqual(blogs.length, helper.initialBlogs.length);
});

test("unique identifier property of blog post is named id", async () => {
    const blogs = await helper.blogsInDb();
    assert(blogs[0].hasOwnProperty("id"), true);
});

test.only("a valid blog can be added", async () => {
    const blogsBeforeAdding = await helper.blogsInDb();
    const newBlog = {
        title: "Go To Statement Considered Harmful 2",
        author: "Edsger W. Dijkstra",
        content: "<p>An extension of the classic paper on goto statements.</p>",
        likes: 6,
    };
    await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

    const blogsAfterAdding = await helper.blogsInDb();
    assert.strictEqual(blogsBeforeAdding.length + 1, blogsAfterAdding.length);
    const addedBlog = blogsAfterAdding[blogsAfterAdding.length - 1];
    assert(
        addedBlog.title.includes("Go To Statement Considered Harmful 2"),
        true
    );
});

test.only("adding blog without token will be denied", async () => {
    const blogsBeforeAdding = await helper.blogsInDb();
    const newBlog = {
        title: "Go To Statement Considered Harmful 2",
        author: "Edsger W. Dijkstra",
        content: "<p>An extension of the classic paper on goto statements.</p>",
        likes: 6,
    };
    await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(401)

    const blogsAfterAdding = await helper.blogsInDb();
    assert.strictEqual(blogsBeforeAdding.length, blogsAfterAdding.length);
})

test("when the likes property is missing, it will default to the value 0", async () => {
    const newBlog = {
        title: "Go To Statement Considered Harmful 2",
        author: "Edsger W. Dijkstra",
        content: "<p>An extension of the classic paper on goto statements.</p>",
    };
    await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

    const blogsAfterAdding = await helper.blogsInDb();
    const addedBlog = blogsAfterAdding[blogsAfterAdding.length - 1];
    assert.strictEqual(addedBlog.likes, 0);
});

test("blog without title or content is not added", async () => {
    const newBlogWithoutTitle = {
        author: "Edsger W. Dijkstra",
        content: "<p>An extension of the classic paper on goto statements.</p>",
    };
    await api
        .post("/api/blogs")
        .send(newBlogWithoutTitle)
        .expect(400)
        .expect("Content-Type", /application\/json/);

    const newBlogWithoutContent = {
        title: "Go To Statement Considered Harmful 2",
        author: "Edsger W. Dijkstra",
    };
    await api
        .post("/api/blogs")
        .send(newBlogWithoutContent)
        .expect(400)
        .expect("Content-Type", /application\/json/);
});

test("Delete a single blog post", async () => {
    const blogsBeforeDelete = await helper.blogsInDb();
    const blogId = blogsBeforeDelete[0].id;
    await api.delete(`/api/blogs/${blogId}`).expect(204);

    const blogsAfterDetele = await helper.blogsInDb();
    assert.strictEqual(blogsBeforeDelete.length - 1, blogsAfterDetele.length);
});

test("Update like for a blog", async () => {
    const updateLike = { likes: 10 };
    const blogsBeforeUpdate = await helper.blogsInDb();
    const blogId = blogsBeforeUpdate[0].id;
    await api
        .put(`/api/blogs/${blogId}`)
        .send(updateLike)
        .expect(200)
        .expect("Content-Type", /application\/json/);
});
after(async () => {
    await moogoose.connection.close();
});
