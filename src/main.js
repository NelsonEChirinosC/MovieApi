// Base de todas las imagines que tengan 300 de width
const BASE_IMGPATH_W300 = 'https://image.tmdb.org/t/p/w300';
const BASE_IMGPATH_W500 = 'https://image.tmdb.org/t/p/w500';

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////// SIN AXIOS /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// const BASE_URL = 'https://api.themoviedb.org/3';

// async function getTrendingMoviesPreview () {

//     const res = await fetch(`${BASE_URL}/trending/movie/day?api_key=${API_KEY}`);
//     const data = await res.json();

//     const movies = data.results;

//     console.log(data, movies)

//     const trendingPreviewMoviesContainer = document.querySelector('#trendingPreview .trendingPreview-movieList');

//     movies.forEach(movie => {

//         const movieContainer = document.createElement('div');
//         movieContainer.classList.add('movie-container');
        
//         const movieImg = document.createElement('img');
//         movieImg.classList.add('movie-img');
//         movieImg.setAttribute('alt', movie.title);
//         movieImg.src = `${BASE_IMGPATH_W300}${movie.poster_path}`;

//         movieContainer.appendChild(movieImg);
//         trendingPreviewMoviesContainer.appendChild(movieContainer);

//     });

// }

// async function getCategoriesPreview () {

//     const res = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
//     const data = await res.json();

//     const categories = data.genres;

//     const categoriesPreviewMoviesContainer = document.querySelector('#categoriesPreview .categoriesPreview-list');

//     categories.forEach(category => {

//         const categoryContainer = document.createElement('div');
//         categoryContainer.classList.add('category-container');
        
//         const categoryTitle = document.createElement('h3');
//         categoryTitle.classList.add('category-title');
//         categoryTitle.setAttribute('id', `id${category.id}`);
//         const categoryTitleText = document.createTextNode(category.name);

//         categoryTitle.appendChild(categoryTitleText);
//         categoryContainer.appendChild(categoryTitle);
//         categoriesPreviewMoviesContainer.appendChild(categoryContainer);

//     });

// }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////// CON AXIOS: TRABAJAR MEJOR DE ESTA MANERA ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const api = axios.create({
    baseURL:'https://api.themoviedb.org/3',
    header: {
        'Content-Type': 'application/json;charset=utf-8'
    },
    params: {
        'api_key': API_KEY
    }
});

//Utils

function createMovies(container, movies){
    
    container.innerHTML = '';

    movies.forEach(movie => {

        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');
        movieContainer.addEventListener('click', ()=> {
            location.hash = `#movie=${movie.id}`;
        } )
        
        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt', movie.title);
        movieImg.src = `${BASE_IMGPATH_W300}${movie.poster_path}`;

        movieContainer.appendChild(movieImg);
        container.appendChild(movieContainer);

    });

}

function createCategories(container, categories){

    container.innerHTML = '';

    categories.forEach(category => {

        const categoryContainer = document.createElement('div');
        categoryContainer.classList.add('category-container');
        
        const categoryTitle = document.createElement('h3');
        categoryTitle.classList.add('category-title');
        categoryTitle.setAttribute('id', `id${category.id}`);

        categoryTitle.addEventListener('click', () => {
            location.hash = `#category=${category.id}-${category.name}`;
        });

        const categoryTitleText = document.createTextNode(category.name);

        categoryTitle.appendChild(categoryTitleText);
        categoryContainer.appendChild(categoryTitle);
        container.appendChild(categoryContainer);

    });

}


// LLamados a la API

async function getTrendingMoviesPreview () {

    const {data} = await api('/trending/movie/day');
    const movies = data.results;

    createMovies(trendingMoviesPreviewList, movies);

}

async function getCategoriesPreview () {

    const {data} = await api('/genre/movie/list');
    const categories = data.genres;

    createCategories(categoriesPreviewList, categories);
}

async function getMoviesByCategory (id) {

    const {data} = await api('/discover/movie', {
        params: {
            with_genres: id
        }
    });

    const movies = data.results;

    createMovies(genericSection, movies);

}

async function getMoviesBySearch (query) {

    const {data} = await api('/search/movie', {
        params: {
            query
        }
    });

    const movies = data.results;

    createMovies(genericSection, movies);

}

async function getTrendingMovies () {

    const {data} = await api('/trending/movie/day');
    const movies = data.results;

    createMovies(genericSection, movies);

}

async function getMovieById (id) {

    const { data:movie } = await api(`/movie/${id}`);

    movieDetailTitle.innerHTML = movie.title;
    movieDetailDescription.innerHTML = movie.overview;
    movieDetailScore.innerHTML = movie.vote_average;

    const movieUrl = `${BASE_IMGPATH_W500}${movie.poster_path}`;

    // headerSection.style.background = `url(${movieUrl})`;
    headerSection.style.background = `linear-gradient(180deg, rgba(0, 0, 0, 0.35) 19.27%, rgba(0, 0, 0, 0) 29.17%), url(${movieUrl})`;

    console.log(movie)

    createCategories(movieDetailCategoriesList, movie.genres);

    getSimilarMovies(id);

    // headerSection.style.backgroundImage = `url(${BASE_IMGPATH_W300}${movie.backdrop_path})`;

}

async function getSimilarMovies(id){
    const { data } = await api(`/movie/${id}/similar`);

    const movies = data.results;

    createMovies( relatedMoviesContainer,movies)

}



