const express = require( 'express' );
const bodyParser = require('body-parser');
const morgan = require('morgan');
const uuid = require('uuid');

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

function validateApiKey(req, res, next){

	if(req.headers.authorization === `Bearer ${apiKEY}`){
		next();
	} else if(req.query.apiKey === apiKEY){
		next();
	} else if(req.headers['book-api-key'] === apiKEY){
		next();
	}

	req.statusMessage = "No API key sent.";
	return res.status(401).end();
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

	return res.status(200).json(listOfBookmarks);
	
});

app.get('/bookmark', (req, res) => {
	console.log("Getting a bookmark by title using query string.");

	console.log(req.query);

	let title = req.query.title;

	if(title == undefined){
		res.statusMessage = "Please send the 'title' as parameter.";
		return res.status(406).end();
	}

	let result = listOfBookmarks.find((bookmark) => {
		if(bookmark.title == title){
			return bookmark;
		}
	});

	if(!result){
		res.statusMessage = "There are no bookmarks with the provided 'title'.";
		return res.status(404).end();
	}

	return res.status(200).json(result);
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

	let newBookmark = {id, title, description, url, rating};
	listOfBookmarks.push( newBookmark );

	return res.status(201).json({});
});

app.delete('/bookmark/:id', (req, res) => {
	
	let id = req.params.id;

	if(!id){
		res.statusMessage = "Please send the 'id' to delete a bookmark";
		return res.status(406).end();
	}

	let itemToRemove = listOfBookmarks.findIndex((bookmark) => {
		if(bookmark.id == id){
			return true;
		}
	});

	if (itemToRemove < 0){
		res.statusMessage = "That 'id' was not found in the list of bookmarks.";
		return res.status(404).end();
	}

	listOfBookmarks.splice(itemToRemove, 1);
	return res.status(200).end();
});

app.patch('/bookmark/:id', jsonParser, (req, res) => {
	
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

	let itemToUpdate = listOfBookmarks.findIndex((bookmark) => {
		if(bookmark.id == id){
			return true;
		}
	});

	if (itemToUpdate < 0){
		res.statusMessage = "That 'id' was not found in the list of bookmarks.";
		return res.status(409).end();
	}

	// Pass in the body an object with the updated content of the bookmark.
	let flag = false;

	if(title != undefined){
		listOfBookmarks[itemToUpdate].title = title;
		flag = true;
	}
	if(description != undefined){
		listOfBookmarks[itemToUpdate].description = description;
		flag = true;
	}
	if(url != undefined){
		listOfBookmarks[itemToUpdate].url = url;
		flag = true;
	}
	if(rating != undefined){
		listOfBookmarks[itemToUpdate].rating = rating;
		flag = true;
	}

	if(!flag){
		res.statusMessage = "No parameters were sent to update.";
		return res.status(406).end();
	}

	return res.status(202).json(listOfBookmarks[itemToUpdate]);
});

app.listen( 8080, () => {
	console.log("This server is running on port 8080");
});


// Base URL : http://localhost:8080/
// GET endpoint: http://localhost:8080/bookmarks
// GET endpoint with title parameter: http://localhost:8080/bookmark?title=value
// POST endpoint: http://localhost:8080/bookmarks
// DELETE endpoint: http://localhost:8080/bookmark/:id