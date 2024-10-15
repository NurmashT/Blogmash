import express from "express";
import post from "../models/post.js";

const router = express.Router();


/*
 GET /
 Home
*/
router.get('/', async (req, res) => {
    try {
        const locals = {
            title: "Blog Website",
            description: "Simple Blog Created with NodeJS, Express and MongoDB."
        }

        let perPage = 10;
        let page = req.query.page || 1;

        const data = await post.aggregate([ { $sort: { createdAt: -1 } } ])
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec();

        const count = await post.countDocuments();
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);

        res.render('index', {
            locals,
            data, 
            current: page,
            nextPage: hasNextPage ? nextPage : null,
            currentRoute: '/'
        });

    } catch (error) {
        console.log(error);
    }
});

/*
 GET /
 Post-id
*/
router.get('/post/:id', async (req, res)  => {
    try {
        let chosen_article = req.params.id;

        const data = await post.findById(chosen_article);

        const locals = {
            title: data.title,
            description: "Simple Blog Created with NodeJS, Express and MongoDB."
        }

        res.render('post', { 
            locals, 
            data,
            currentRoute: `/post/${chosen_article}`
        });
    } catch (error) {
        console.log(error);
    }
})

/**
 POST /
 Search-Term
*/
router.post('/search', async (req, res)  => {
    try {
        const locals = {
            title: "Search",
            description: "Simple Blog Created with NodeJS, Express and MongoDB."
        }

        let searchTerm = req.body.searchTerm;
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");
        console.log(`User is searching for: ${searchTerm}`);

        const data = await post.find({
            $or: [
                { title: { $regex: new RegExp(searchNoSpecialChar, "i") } },
                { body: { $regex: new RegExp(searchNoSpecialChar, "i") } }
            ]
        });

        res.render('search', {locals, data, currentRoute: '/search'});
    } catch (error) {
        console.log(error);
    }
})

/**
 GET /
 About
*/
router.get('/about', (req, res) => {
    res.render('about', {
      currentRoute: '/about'
    });
  });

export default router;