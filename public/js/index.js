const apiKEY = "2abbf7c3-245b-404f-9473-ade729ed4653";
let bookmarksSection = document.getElementById('bookmarks-section');

function fetchBookmarks(){
	bookmarksSection.innerHTML = "";
	let url = "/bookmarks";
	let settings = {
		method : 'GET',
		headers : {
			Authorization : `Bearer ${apiKEY}`
		}
	}

	fetch( url, settings )
		.then( response => {
			if( response.ok ){
				return response.json();
			}
			throw new Error( response.statusText );
		})
		.then( responseJSON => {
			for(let i = 0; i < responseJSON.length; i++){
				bookmarksSection.innerHTML += `	<div>
													<div>
														Id: ${responseJSON[i].id}
													</div>
													<div>
														Title: ${responseJSON[i].title}
													</div>
													<div>
														Description: ${responseJSON[i].description}
													</div>
													<div>
														Url: ${responseJSON[i].url}
													</div>
													<div>
														Rating: ${responseJSON[i].rating}
													</div>
												</div>`;
			}
			
		})
		.catch( err => {
			bookmarksSection.innerHTML = `<div>${err.message}</div>`
		});
}


function postBookmark(){
	let postBtn = document.getElementById('create-btn');

	postBtn.addEventListener('click', (event) => {
		event.preventDefault();

		let titleInput = document.getElementById('title-input-post').value;
		let descriptionInput = document.getElementById('description-input-post').value;
		let urlInput = document.getElementById('url-input-post').value;
		let ratingInput = document.getElementById('rating-input-post').value;

		let url = "/bookmarks";
		let settings = {
			method : 'POST',
			headers : {
				Authorization : `Bearer ${apiKEY}`,
				'Content-Type' : 'application/json'
			},
			body : JSON.stringify({
				title : titleInput, 
				description : descriptionInput, 
				url : urlInput, 
				rating : ratingInput})
		};

		fetch( url, settings )
			.then( response => {
				if( response.ok ){
					return response.json();
				}
				throw new Error( response.statusText );
			})
			.then( responseJSON => {
				fetchBookmarks();
			})
			.catch( err => {
				bookmarksSection.innerHTML = `<div>${err.message}</div>`
			});

	});
}

function deleteBookmark(){
	let deleteBtn = document.getElementById('delete-btn');

	deleteBtn.addEventListener('click', (event) => {
		event.preventDefault();

		let idInput = document.getElementById('id-input-delete').value;

		let url = `/bookmark/${idInput}`;
		let settings = {
			method : 'DELETE',
			headers : {
				Authorization : `Bearer ${apiKEY}`,
			}
		};

		fetch( url, settings )
			.then( response => {
				if( !response.ok ){
					throw new Error( response.statusText );
				}
			})
			.then( responseJSON => {
				fetchBookmarks();
			})
			.catch( err => {
				bookmarksSection.innerHTML = `<div>${err.message}</div>`
			});
	});
}

function updateBookmark(){
	let updateBtn = document.getElementById('update-btn');

	updateBtn.addEventListener('click', (event) => {
		event.preventDefault();

		let idInput = document.getElementById('id-input-update').value;
		let titleInput = document.getElementById('title-input-update').value;
		let descriptionInput = document.getElementById('description-input-update').value;
		let urlInput = document.getElementById('url-input-update').value;
		let ratingInput = document.getElementById('rating-input-update').value;

		let content = {};

		if(titleInput != "") content.title = titleInput;
		if(descriptionInput != "") content.description = descriptionInput;
		if(urlInput != "") content.url = urlInput;
		if(ratingInput != "") content.rating = ratingInput;

		let url = `/bookmark/${idInput}`;
		let settings = {
			method : 'PATCH',
			headers : {
				Authorization : `Bearer ${apiKEY}`,
				'Content-Type' : 'application/json'
			},
			body : JSON.stringify(content)
		};

		fetch( url, settings )
			.then( response => {
				if( response.ok ){
					return response;
				}
				throw new Error( response.statusText );
			})
			.then( responseJSON => {
				fetchBookmarks();
			})
			.catch( err => {
				bookmarksSection.innerHTML = `<div>${err.message}</div>`
			});

	});
}

function getBookmark(){
	let getBtn = document.getElementById('get-btn');

	getBtn.addEventListener('click', (event) => {
		event.preventDefault();

		let titleInput = document.getElementById('title-input-get').value;

		if(titleInput != ""){
			let url = `/bookmark?title=${titleInput}`;
			let settings = {
				method : 'GET',
				headers : {
					Authorization : `Bearer ${apiKEY}`
				}
			}

			fetch( url, settings )
				.then( response => {
					if( response.ok ){
						return response.json();
					}
					throw new Error( response.statusText );
				})
				.then( responseJSON => {
					bookmarksSection.innerHTML = 
					`<div>
						<div>
							Id: ${responseJSON[0].id}
						</div>
						<div>
							Title: ${responseJSON[0].title}
						</div>
						<div>
							Description: ${responseJSON[0].description}
						</div>
						<div>
							Url: ${responseJSON[0].url}
						</div>
						<div>
							Rating: ${responseJSON[0].rating}
						</div>
					</div>`;	
				})
				.catch( err => {
					bookmarksSection.innerHTML = `<div>${err.message}</div>`;
				});
		} else {
			bookmarksSection.innerHTML = `<div>Please insert an Id.</div>`;
		}
	});
}


function init(){
	fetchBookmarks();
	postBookmark();
	deleteBookmark();
	updateBookmark();
	getBookmark();
}

init();