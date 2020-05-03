const mongoose = require('mongoose');

const bookmarksCollectionSchema = mongoose.Schema({
	id : {
		type : String,
		required : true,
		unique : true
	},
	title : {
		type : String,
		required : true
	},
	description : {
		type : String,
		required : true
	},
	url : {
		type : String,
		required : true
	},
	rating : {
		type : Number,
		required : true
	}
});

const bookmarksCollection = mongoose.model('bookmarks', bookmarksCollectionSchema);

const Bookmarks = {
	createBookmark : function(newBookmark){
		return bookmarksCollection
			.create(newBookmark)
			.then(createdBookmark => {
				return createdBookmark;
			})
			.catch(err => {
				return err;
			});
	},
	getAllBookmarks : function(){
		return bookmarksCollection
				.find()
				.then(allBookmarks => {
					return allBookmarks;
				})
				.catch(err => {
					return err;
				});
	},
	getBookmark : function(titlesearch){
		return bookmarksCollection
				.find({title: `${titlesearch}`})
				.then(foundBookmark => {
					return foundBookmark;
				})
				.catch(err => {
					return err;
				});
	},
	deleteBookmark : function(idsearch){
		return bookmarksCollection
				.deleteOne({id: `${idsearch}`})
				.then(deletedBookmark => {
					return deletedBookmark;
				})
				.catch(err => {
					return err;
				});
	},
	patchBookmark : function(idsearch, updateQuery){
		return bookmarksCollection
				.updateOne({id: idsearch}, { $set : updateQuery })
				.then(updatedBookmark => {
					return updatedBookmark;
				})
				.catch(err => {
					return err;
				});
	}
}

module.exports = {Bookmarks};