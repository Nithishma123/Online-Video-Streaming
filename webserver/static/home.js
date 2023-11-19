document.addEventListener('DOMContentLoaded', function () {

    fetchAndDisplayTrending();
    fetchAndDisplayRecentlyWatched();

    function fetchAndDisplayMovies() {
        fetch('http://192.168.1.30:8111/api/movies/2')
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

        movieCard.innerHTML = `
            <h3>${movie.name}</h3>
            <p>${movie.description}</p>
            <p>Duration: ${movie.duration}</p>
            <a href="${movie.video_link}" target="_blank">IMDb Link</a>
        `;

        return movieCard;
    }

    document.getElementById('categories').addEventListener('click', function () {
        fetchAndDisplayCategories();
    });

    function fetchAndDisplayCategories() {
        fetch('http://192.168.1.30:8111/api/categories')
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
        fetch(`http://192.168.1.30:8111/api/movies/${categoryId}`)
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
        document.getElementById('moviesContainer').style.display = 'block';
        document.getElementById('trendingSection').style.display = 'none';
        document.getElementById('recentlyWatchedSection').style.display = 'none';
        document.getElementById('categoriesContainer').style.display = 'none';
        document.getElementById('genresContainer').style.display = 'none';
        document.getElementById('castContainer').style.display = 'none';
    }

    function showCategoriesSection() {
        document.getElementById('categoriesContainer').style.display = 'block';
        document.getElementById('trendingSection').style.display = 'none';
        document.getElementById('recentlyWatchedSection').style.display = 'none';
        document.getElementById('moviesContainer').style.display = 'none';
        document.getElementById('genresContainer').style.display = 'none';
        document.getElementById('castContainer').style.display = 'none';
    }
    //genres
    document.getElementById('genres').addEventListener('click', function () {
        fetchAndDisplayGenres();
    });

    function fetchAndDisplayGenres() {
        fetch('http://192.168.1.30:8111/api/genres')
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
        fetch(`http://192.168.1.30:8111/api/movies/genre/${genreId}`)
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
        document.getElementById('genresContainer').style.display = 'block';
        document.getElementById('categoriesContainer').style.display = 'none';
        document.getElementById('trendingSection').style.display = 'none';
        document.getElementById('recentlyWatchedSection').style.display = 'none';
        document.getElementById('moviesContainer').style.display = 'none';
        document.getElementById('castContainer').style.display = 'none';
    }

    //cast
    document.getElementById('cast').addEventListener('click', function () {
        fetchAndDisplayCast();
    });

    function fetchAndDisplayCast() {
        fetch('http://192.168.1.30:8111/api/cast')
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
        fetch(`http://192.168.1.30:8111/api/movies/cast/${castId}`)
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
        document.getElementById('castContainer').style.display = 'block';
        document.getElementById('genresContainer').style.display = 'none';
        document.getElementById('categoriesContainer').style.display = 'none';
        document.getElementById('trendingSection').style.display = 'none';
        document.getElementById('recentlyWatchedSection').style.display = 'none';
        document.getElementById('moviesContainer').style.display = 'none';
    }


    document.getElementById('home').addEventListener('click', function () {
        fetchAndDisplayTrending();
        fetchAndDisplayRecentlyWatched();
    });

    function fetchAndDisplayTrending() {
        fetch('http://192.168.1.30:8111/api/trending')
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
        fetch('http://192.168.1.30:8111/api/recently-watched')
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
    document.getElementById('trendingSection').style.display = 'block';
    document.getElementById('recentlyWatchedSection').style.display = 'block';
    document.getElementById('castContainer').style.display = 'none';
    document.getElementById('genresContainer').style.display = 'none';
    document.getElementById('categoriesContainer').style.display = 'none';
    document.getElementById('moviesContainer').style.display = 'none';
}
});
