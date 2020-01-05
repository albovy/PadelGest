const Blog = require("../models/Blog");

class BlogModel {
    constructor() {}

    findAll(){
        return Blog.find();
    }

    findById(id){
        return Blog.findById(id);
    }

    async add(body) {
        console.log(body);
        let blog = new Blog(body);
        try {
            return await blog.save();
        } catch (err) {
            console.log("F");
            return await new Promise((resolve, reject) => reject(err));
        }
    }

    async update(id, data) {
        try {
            const blog = await Blog.updateOne({ _id: id }, data);
            return blog;
        } catch (err) {
            return await new Promise((resolve, reject) => reject(err));
        }
    }

    delete(id) {
        return Blog.deleteOne({ _id: id });
    }
}

module.exports = new BlogModel();