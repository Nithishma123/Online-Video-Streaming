document.addEventListener('DOMContentLoaded', function () {

    fetchAndDisplayTrending();
    fetchAndDisplayRecentlyWatched();

    function fetchAndDisplayMovies() {
        fetch('http://127.0.0.1:8111/api/movies/2')
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    displayMovies(data.items);
                    showMoviesSection();
                } else {
                    console.error('Failed to fetch movies:', data.status);
                }
            })
            .catch(error => console.error('Error fetching movies:', error));
    }

    document.getElementById('movies').addEventListener('click', function () {
        fetchAndDisplayMovies();
    });

    function displayMovies(movies) {
        const movieContainer = document.getElementById('movieContainer');
        movieContainer.innerHTML = '';

        movies.forEach(movie => {
            const movieCard = createMovieCard(movie);
            movieContainer.appendChild(movieCard);
        });
    }

    function createMovieCard(movie) {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        const videoId = movie.video_id;
        movieCard.innerHTML = `
            <h3>${movie.name}</h3>
            <p>${movie.description}</p>
            <p>Duration: ${movie.duration}</p>
            <a href="#" class="read-reviews" data-movie-id="${videoId}">Reviews</a>
            </br></br>
            <iframe src="${movie.video_link}" width="500px" height="300px" data-video-id="${videoId}"></iframe>
            `;
        const readReviewsLink = movieCard.querySelector('.read-reviews');

   readReviewsLink.addEventListener('click', function (event) {
            event.preventDefault();
            const videoId = this.getAttribute('data-movie-id');

            fetch(`http://127.0.0.1:8111/api/reviews/${videoId}`)
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        // Display reviews in a dialog box
                        showReviewsDialog(data.items, videoId);
                    } else {
                        console.error('Failed to fetch reviews:', data.status);
                    }
                })
                .catch(error => console.error('Error fetching reviews:', error));
        });


        return movieCard;
    }

   function showReviewsDialog(reviews, videoId) {
    // Create a dialog box

    const dialogBox = document.createElement('div');
    dialogBox.classList.add('dialog-box');
    const ratingLabel = document.createElement('label');
    ratingLabel.textContent = '    Rating:';
    const ratingInput = document.createElement('input');
    ratingInput.type = 'range';
    ratingInput.min = 1;
    ratingInput.max = 10;


    // Create a close button
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.addEventListener('click', function () {
        // Close the dialog box
        dialogBox.remove();
    });

    // Create a textarea for adding a new review
    const newReviewTextarea = document.createElement('textarea');
    newReviewTextarea.placeholder = 'Write your review...';

    // Create a button to submit the new review
    const submitReviewButton = document.createElement('button');
    submitReviewButton.textContent = 'Submit Review';
    submitReviewButton.addEventListener('click', function () {
        const newReviewText = newReviewTextarea.value;
        const newRating = ratingInput.value;
        submitReview(videoId, newReviewText,newRating);
    });

    // Append elements to the dialog box


    // Display existing reviews
    const reviewsContainer = document.createElement('div');
    const reviewsItem = document.createElement('h2');
    reviewsItem.textContent = "Review \t \t \t - Rating";
    reviewsContainer.appendChild(reviewsItem);

    reviews.forEach(review => {
        const reviewItem = document.createElement('p');
        reviewItem.textContent = review.comment_string+"  - "+review.rating;
        reviewsContainer.appendChild(reviewItem);
    });
    dialogBox.appendChild(reviewsContainer);

    // Display textarea and submit button for a new review
    dialogBox.appendChild(newReviewTextarea);
    dialogBox.appendChild(ratingLabel);
    dialogBox.appendChild(ratingInput);
    dialogBox.appendChild(submitReviewButton);
    dialogBox.appendChild(closeButton);

    // Append the dialog box to the body
    document.body.appendChild(dialogBox);
}

function submitReview(videoId, reviewText, rating) {
    const apiUrl = 'http://127.0.0.1:8111/api/write-reviews';

    // Assuming your API requires a POST request with the review details
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            video_id: videoId,
            comment_string: reviewText,
            rating: rating,
            // Add any other required parameters
        }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            // Optionally, you can update the UI or perform other actions on success
            console.log('Review submitted successfully:', data);
        } else {
            console.error('Failed to submit review:', data.status);
        }
    })
    .catch(error => console.error('Error submitting review:', error));
}



    document.getElementById('categories').addEventListener('click', function () {
        fetchAndDisplayCategories();
    });

    function fetchAndDisplayCategories() {
        fetch('http://127.0.0.1:8111/api/categories')
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    displayCategories(data.items);
                    showCategoriesSection();
                } else {
                    console.error('Failed to fetch categories:', data.status);
                }
            })
            .catch(error => console.error('Error fetching categories:', error));
    }

    function displayCategories(categories) {
        const categoriesContainer = document.getElementById('categoriesContainer');
        categoriesContainer.innerHTML = '';

        categories.forEach(category => {
            const categoryItem = createCategoryItem(category);
            categoriesContainer.appendChild(categoryItem);
        });
    }

    function createCategoryItem(category) {
        const categoryItem = document.createElement('div');
        categoryItem.classList.add('category-item');

        categoryItem.innerHTML = `
            <h3>${category.category_name}</h3>
        `;

        categoryItem.addEventListener('click', function () {
            console.log(`Clicked on category: ${category.category_name}, ID: ${category.category_id}`);
            fetchAndDisplayMoviesByCategory(category.category_id);
        });

        return categoryItem;
    }

    function fetchAndDisplayMoviesByCategory(categoryId) {
        fetch(`http://127.0.0.1:8111/api/movies/${categoryId}`)
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    displayMovies(data.items);
                    showMoviesSection();
                } else {
                    console.error('Failed to fetch movies by category:', data.status);
                }
            })
            .catch(error => console.error('Error fetching movies by category:', error));
    }

    function showMoviesSection() {

    hideAllSections();
            document.getElementById('moviesContainer').style.display = 'block';
    }

    function showCategoriesSection() {
     hideAllSections();
        document.getElementById('categoriesContainer').style.display = 'block';
    }
    //genres
    document.getElementById('genres').addEventListener('click', function () {
        fetchAndDisplayGenres();
    });

    function fetchAndDisplayGenres() {
        fetch('http://127.0.0.1:8111/api/genres')
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    displayGenres(data.items);
                    showGenresSection();
                } else {
                    console.error('Failed to fetch genres:', data.status);
                }
            })
            .catch(error => console.error('Error fetching genres:', error));
    }

    function displayGenres(genres) {
        const genresContainer = document.getElementById('genresContainer');
        genresContainer.innerHTML = '';

        genres.forEach(genre => {
            const genreItem = createGenreItem(genre);
            genresContainer.appendChild(genreItem);
        });
    }

    function createGenreItem(genre) {
        const genreItem = document.createElement('div');
        genreItem.classList.add('genre-item');

        genreItem.innerHTML = `
            <h3>${genre.name}</h3>
        `;

        genreItem.addEventListener('click', function () {
            fetchAndDisplayMoviesByGenre(genre.genre_id);
        });

        return genreItem;
    }

    function fetchAndDisplayMoviesByGenre(genreId) {
        fetch(`http://127.0.0.1:8111/api/movies/genre/${genreId}`)
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    displayMovies(data.items);
                    showMoviesSection();
                } else {
                    console.error('Failed to fetch movies by genre:', data.status);
                }
            })
            .catch(error => console.error('Error fetching movies by genre:', error));
    }

    function showGenresSection() {
        hideAllSections();
        document.getElementById('genresContainer').style.display = 'block';
    }

    //cast
    document.getElementById('cast').addEventListener('click', function () {
        fetchAndDisplayCast();
    });

    function fetchAndDisplayCast() {
        fetch('http://127.0.0.1:8111/api/cast')
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    displayCast(data.items);
                    showCastSection();
                } else {
                    console.error('Failed to fetch cast:', data.status);
                }
            })
            .catch(error => console.error('Error fetching cast:', error));
    }

    function displayCast(casts) {
        const castContainer = document.getElementById('castContainer');
        castContainer.innerHTML = '';

        casts.forEach(cast => {
            const castItem = createCastItem(cast);
            castContainer.appendChild(castItem);
        });
    }

    function createCastItem(cast) {
        const castItem = document.createElement('div');
        castItem.classList.add('cast-item');

        castItem.innerHTML = `
            <h3>${cast.actor_name}</h3>
        `;

        castItem.addEventListener('click', function () {
            fetchAndDisplayMoviesByCast(cast.actor_id);
        });

        return castItem;
    }

    function fetchAndDisplayMoviesByCast(castId) {
        fetch(`http://127.0.0.1:8111/api/movies/cast/${castId}`)
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    displayMovies(data.items);
                    showMoviesSection();
                } else {
                    console.error('Failed to fetch movies by cast:', data.status);
                }
            })
            .catch(error => console.error('Error fetching movies by cast:', error));
    }

    function showCastSection() {
        hideAllSections();
        document.getElementById('castContainer').style.display = 'block';
    }


    document.getElementById('home').addEventListener('click', function () {
        fetchAndDisplayTrending();
        fetchAndDisplayRecentlyWatched();
    });

    function fetchAndDisplayTrending() {
        fetch('http://127.0.0.1:8111/api/trending')
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    displayTrending(data.items);
                    showTrendingSection();
                } else {
                    console.error('Failed to fetch trending:', data.status);
                }
            })
            .catch(error => console.error('Error fetching trending:', error));
    }

    function fetchAndDisplayRecentlyWatched() {
        fetch('http://127.0.0.1:8111/api/recently-watched')
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    displayRecentlyWatched(data.items);
                    showTrendingSection();
                } else {
                    console.error('Failed to fetch trending:', data.status);
                }
            })
            .catch(error => console.error('Error fetching trending:', error));
    }

    function displayTrending(movies) {
        const trendingContainer = document.getElementById('trendingContainer');
        trendingContainer.innerHTML = '';

        movies.forEach(movie => {
            const movieCard = createMovieCard(movie);
            trendingContainer.appendChild(movieCard);
        });
    }

    function displayRecentlyWatched(movies) {
        const watchedContainer = document.getElementById('watchedContainer');
        watchedContainer.innerHTML = '';

        movies.forEach(movie => {
            const movieCard = createMovieCard(movie);
            watchedContainer.appendChild(movieCard);
        });
    }

    function showTrendingSection() {
    hideAllSections();
    document.getElementById('trendingSection').style.display = 'block';
    document.getElementById('recentlyWatchedSection').style.display = 'block';
}


function updateViewed(videoId){

fetch('http://127.0.0.1:8111/api/viewing', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({videoId})
        })
        .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            // Optionally, you can update the UI or perform other actions on success
            console.log('Review submitted successfully:', data);
        } else {
            console.error('Failed to submit review:', data.status);
        }
    })
    .catch(error => console.error('Error submitting review:', error));
    };


const message = document.getElementById("message");
window.focus()

window.addEventListener("blur", () => {
  setTimeout(() => {
    if (document.activeElement.tagName === "IFRAME") {

      const videoId = document.activeElement.getAttribute('data-video-id');
      updateViewed(videoId)
      console.log("clicked");
    }
  });
}, { once: true });


document.getElementById('logout').addEventListener('click', function () {
        logoutUser();
    });

function logoutUser() {
        localStorage.removeItem('authToken');
        window.location.href = '/';
    }
document.getElementById('viewProfileTab').addEventListener('click', function () {
        fetchAndDisplayProfile();
    });

    // Function to fetch and display profile information
    function fetchAndDisplayProfile() {
        // Assuming you have an API endpoint for fetching profile information
        fetch('http://127.0.0.1:8111/api/profile')
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    displayProfile(data.items[0]);
                    // Show the profile section (adjust the function name accordingly)
                    showProfileSection();
                } else {
                    console.error('Failed to fetch profile:', data.status);
                }
            })
            .catch(error => console.error('Error fetching profile:', error));
    }


function displayProfile(profile) {
    const profileContainer = document.getElementById('profileContainer');
    profileContainer.innerHTML = '';
    profileContainer.appendChild(createProfile(profile));
}

function createProfile(profile) {
    const profileItem = document.createElement('div');
    profileItem.classList.add('profile-item');

    // Determine the subscription type based on the expiry status
    let subscriptionType;
    let memberExpiry;
    let since;
    if (profile.expiry !== null) {
    subscriptionType = 'Annual Subscription';
        memberExpiry = profile.expiry
    } else if (profile.plan_expiry !== null) {
        subscriptionType = 'Monthly Subscription';
        memberExpiry = profile.plan_expiry
    } else {
        subscriptionType = 'No Subscription';
        memberExpiry = 'N/A'
    }

    if(profile.since !==null){
    since = profile.since;
    }else{
    since = 'N/A'
    }

    profileItem.innerHTML = `
        <h3>Name: ${profile.name}</h3>
        <p>Age: ${profile.age}</p>
        <p>Gender: ${profile.gender}</p>
        <p>Phone Number: ${profile.phone_no}</p>
        <p>Subscription: ${subscriptionType}</p>
        <p>Plan Expiry: ${memberExpiry}</p>
        <p>Member Since: ${since}</p>`;

    // Add other profile information as needed
    return profileItem;
}

// Function to show the profile section and hide other sections
function showProfileSection() {
    // Assuming you have container elements for other sections
    hideAllSections();
    document.getElementById('profilesContainer').style.display = 'block';
}

    // Add an event listener for the "View Cards" tab
    document.getElementById('viewCardsTab').addEventListener('click', function () {
        fetchAndDisplayCards();
    });

    // Function to fetch and display cards information
    function fetchAndDisplayCards() {
        // Assuming you have an API endpoint for fetching cards information
        fetch('http://127.0.0.1:8111/api/cards')
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    displayCards(data.items);
                    showCardsSection();
                } else {
                    console.error('Failed to fetch cards:', data.status);
                }
            })
            .catch(error => console.error('Error fetching cards:', error));
    }

    function displayCards(cards) {
    const cardContainer = document.getElementById('cardContainer');
    cardContainer.innerHTML = '';
    cards.forEach(card => {
            const cardItem = createCards(card);
            cardContainer.appendChild(cardItem);
        });
}

function createCards(card) {
    const cardItem = document.createElement('div');
    cardItem.classList.add('card-item');

    cardItem.innerHTML = `
    <h3>Name on Card: ${card.name}</h3>
    <p>Card Type: ${card.card_type}</p>
    <p>Card Number: ${card.card_number}</p>
    <p>Expiry Date: ${card.expiry}</p>
    <p>Autopay: ${card.autopay === '1' ? 'Enabled' : 'Disabled'}</p>
    <p>Since: ${card.since}</p>
`;

    return cardItem;
}
    // Function to show the cards section and hide other sections
    function showCardsSection() {
        hideAllSections();
        document.getElementById('cardsContainer').style.display = 'block';
    }

    function hideAllSections(){
        document.getElementById('moviesContainer').style.display = 'none';
        document.getElementById('trendingSection').style.display = 'none';
        document.getElementById('recentlyWatchedSection').style.display = 'none';
        document.getElementById('categoriesContainer').style.display = 'none';
        document.getElementById('genresContainer').style.display = 'none';
        document.getElementById('castContainer').style.display = 'none';
        document.getElementById('profilesContainer').style.display = 'none';
        document.getElementById('cardsContainer').style.display = 'none';
    }
});
