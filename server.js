const express = require( 'express' );
const bodyParser = require('body-parser');
const morgan = require('morgan');
const uuid = require('uuid');
const {Bookmarks} = require('./bookmarkModel');
const mongoose = require('mongoose');

const apiKEY = "2abbf7c3-245b-404f-9473-ade729ed4653";

const app = express();

const jsonParser = bodyParser.json();

app.use( morgan( 'dev' ) );

function middleware(req, res, next){
	console.log("middleware");
	req.test = {};
	req.test.message = "Adding something to the request";
	next();
}

function validateApiKey (req, res, next){

	if(req.headers.authorization === `Bearer ${apiKEY}`){
		next();
	} else if(req.query.apiKey === apiKEY){
		next();
	} else if(req.headers['book-api-key'] === apiKEY){
		next();
	} else {
		req.statusMessage = "No API key sent.";
		return res.status(401).end();
	}
}

app.use(validateApiKey);

let listOfBookmarks = [
	{
		id : uuid.v4(),
		title : "Youtube",
		description: "Watch videos",
		url : "https://www.youtube.com",
		rating : 5
	},
	{
		id : uuid.v4(),
		title : "Facebook",
		description: "Post media with friends",
		url : "https://www.facebook.com",
		rating : 5
	}
];

app.get('/bookmarks', middleware, (req, res) => {
	console.log("Getting all bookmarks.");

	Bookmarks
		.getAllBookmarks()
		.then(result => {
			return res.status(200).json(result);
		})
		.catch(err => {
			res.statusMessage = "Something went wrong with the DB. Try again later.";
			return res.status(500).end();
		});
	
});

app.get('/bookmark', (req, res) => {
	console.log("Getting a bookmark by title using query string.");

	console.log(req.query);

	let title = req.query.title;

	if(title == undefined){
		res.statusMessage = "Please send the 'title' as parameter.";
		return res.status(406).end();
	}

	Bookmarks
		.getBookmark(title)
		.then(result => {
			if(result != ""){
				return res.status(200).json(result);
			} else {
				res.statusMessage = "A bookmark with that title does not exist.";
				return res.status(404).end();
			}
		})
		.catch(err => {
			res.statusMessage = "Something went wrong with the DB. Try again later.";
			return res.status(500).end();
		});
});

app.post('/bookmarks', jsonParser, (req, res) => {

	console.log("Adding a new bookmark to the list.");
	console.log("Body ", req.body);

	let id = uuid.v4();
	let title = req.body.title;
	let description = req.body.description;
	let url = req.body.url;
	let rating = req.body.rating;

	if(!title || !description || !url || !rating){
		res.statusMessage = "Some parameters are missing.";
		return res.status(406).end();
	}


	const newBookmark = {
		id,
		title,
		description,
		url,
		rating
	};

	Bookmarks
		.createBookmark(newBookmark)
		.then(result => {
			return res.status(201).json(result);
		})
		.catch(err => {
			res.statusMessage = "Something went wrong with the DB. Try again later.";
			return res.status(500).end();
		});
});

app.delete('/bookmark/:id', (req, res) => {
	
	let id = req.params.id;

	if(!id){
		res.statusMessage = "Please send the 'id' to delete a bookmark";
		return res.status(406).end();
	}

	Bookmarks
		.deleteBookmark(id)
		.then(result => {
			if(result.deletedCount != 0){
				return res.status(200).end();
			} else {
				res.statusMessage = `Bookmark with id: ${id} not found`;
				return res.status(404).end();
			}
		})
		.catch(err => {
			res.statusMessage = "Something went wrong with the DB. Try again later.";
			return res.status(500).end();
		});
});

app.patch('/bookmark/:id', jsonParser, async(req, res) => {
	
	let id = req.params.id;

	console.log("Body ", req.body);

	let title = req.body.title;
	let description = req.body.description;
	let url = req.body.url;
	let rating = req.body.rating;

	if(!id){
		res.statusMessage = "Please send the 'id' to update a bookmark";
		return res.status(406).end();
	}

	// Pass in the body an object with the updated content of the bookmark.
	let flag = false;

	if(title != undefined){
		await Bookmarks
			.patchBookmark(id, {"title" : title})
			.then(result => {
				if(result.n == 0){
					res.statusMessage = "Could not find bookmark with that id.";
					return res.status(404).end();
				}
			})
			.catch(err => {
				res.statusMessage = "Something went wrong with the DB. Try again later.";
				return res.status(500).end();
			});
		flag = true;
	}
	if(description != undefined){
		await Bookmarks
			.patchBookmark(id, {"description" : description})
			.then(result => {
				if(result.n == 0){
					res.statusMessage = "Could not find bookmark with that id.";
					return res.status(404).end();
				}
			})
			.catch(err => {
				res.statusMessage = "Something went wrong with the DB. Try again later.";
				return res.status(500).end();
			});
		flag = true;
	}
	if(url != undefined){
		await Bookmarks
			.patchBookmark(id, {"url" : url})
			.then(result => {
				if(result.n == 0){
					res.statusMessage = "Could not find bookmark with that id.";
					return res.status(404).end();
				}
			})
			.catch(err => {
				res.statusMessage = "Something went wrong with the DB. Try again later.";
				return res.status(500).end();
			});
		flag = true;
	}
	if(rating != undefined){
		await Bookmarks
			.patchBookmark(id, {"rating" : rating})
			.then(result => {
				if(result.n == 0){
					res.statusMessage = "Could not find bookmark with that id.";
					return res.status(404).end();
				}
			})
			.catch(err => {
				res.statusMessage = "Something went wrong with the DB. Try again later.";
				return res.status(500).end();
			});
		flag = true;
	}

	if(!flag){
		res.statusMessage = "No parameters were sent to update.";
		return res.status(406).end();
	}

	res.statusMessage = "Update successful";
	return res.status(202).end();

});

app.listen( 8080, () => {
	console.log("This server is running on port 8080");

	new Promise(( resolve, reject) => {
		mongoose.connect('mongodb://localhost/bookmarksdb', {useNewUrlParser: true, useUnifiedTopology: true}, (err) => {
			if(err){
				reject(err);
			}
			else{
				console.log("bookmarksdb connected successfully");
				return resolve();
			}
		})
	})
	.catch(err => {
		mongoose.disconnect();
		console.log(err);
	})
});


// Base URL : http://localhost:8080/
// GET endpoint: http://localhost:8080/bookmarks
// GET endpoint with title parameter: http://localhost:8080/bookmark?title=value
// POST endpoint: http://localhost:8080/bookmarks
// DELETE endpoint: http://localhost:8080/bookmark/:id