const dummy = (blogs) => 1;

const totalLikes = (blogs) => {
    return blogs.length === 0 ? 0 : blogs
        .map((blog) => blog.likes)
        .reduce((accumulator, currentValue) => accumulator + currentValue);
};

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
        return 0;
    }
    const likesArr = blogs.map(blog => blog.likes);
    const hightestLike = Math.max(...likesArr);
    const blogWithHighestLike = blogs.find(blog => blog.likes === hightestLike);
    return blogWithHighestLike;
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) {
        return 0;
    }
    const authorArr = blogs.map(blog => blog.author);
    let uniqueAuthorArr = [...authorArr];
    for (let i = uniqueAuthorArr.length - 1; i > 0; i--) {
        if (uniqueAuthorArr[i] === uniqueAuthorArr[i - 1]) {
            uniqueAuthorArr.splice(i, 1);
        }
    }
    uniqueAuthorArr = uniqueAuthorArr.map(author => {
        return { author, blogs: 0 }
    })
    for (let i = 0; i < authorArr.length; i++) {
        for (let j = 0; j < uniqueAuthorArr.length; j++) {
            if (authorArr[i] === uniqueAuthorArr[j].author) {
                uniqueAuthorArr[j].blogs++;
            }
        }
    }
    const highestNumOfBlog = Math.max(...uniqueAuthorArr.map(author => author.blogs))
    return uniqueAuthorArr.find(author => author.blogs === highestNumOfBlog)

}

const mostLikes = (blogs) => {
    if (blogs.length === 0) {
        return 0;
    }
    const authorArr = blogs.map(blog => blog.author);
    let uniqueAuthorArr = [...authorArr];
    for (let i = uniqueAuthorArr.length - 1; i > 0; i--) {
        if (uniqueAuthorArr[i] === uniqueAuthorArr[i - 1]) {
            uniqueAuthorArr.splice(i, 1);
        }
    }
    uniqueAuthorArr = uniqueAuthorArr.map(author => {
        return { author, likes: 0 }
    })

    for (let i = 0; i < blogs.length; i++) {
        for (let j = 0; j < uniqueAuthorArr.length; j++) {
            if (blogs[i].author === uniqueAuthorArr[j].author) {
                uniqueAuthorArr[j].likes += blogs[i].likes
            }
        }
    }
    const highestLike = Math.max(...uniqueAuthorArr.map(author => author.likes));
    return uniqueAuthorArr.find(author => author.likes === highestLike)
}


module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
};
