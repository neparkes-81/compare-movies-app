const fetchData = async (searchTerm) => {
    // when making nework requests this is asyncrous as we have to await a response
    const response = await axios.get('http://www.omdbapi.com/', {
        params: {
            apikey: '77b3dd9d',
            s: searchTerm
        }
    });

    if (response.data.Error){
        return [];
    }

    return response.data.Search;
}
const root = document.querySelector('.autocomplete');
root.innerHTML = `
    <label><b>Search for a movie</b></label>
    <input class="input">
    <div class="dropdown">
        <div class="dropdown-menu">
            <div class="dropdown-content results"></div>
        </div>
    </div>
`

const input = document.querySelector('.input');
const dropdown = document.querySelector('.dropdown');
const resultsWrapper = document.querySelector('.results');

// Since this function is retriving data from an asyncrounous function it must also be treated as such as it is also awaiting that requested data
const onInput = async event => {
    const movies = await fetchData(event.target.value);

    if (!movies.length){
        dropdown.classList.remove('is-active');
        return;

    }

    resultsWrapper.innerHTML = '';
    dropdown.classList.add('is-active')
    for(let movie of movies){
        const option = document.createElement('a');
        const imgSRC = movie.Poster === 'N/A' ? '' : movie.Poster;

        option.classList.add('dropdown-item')
        option.innerHTML = `
            <img src="${imgSRC}">
            ${movie.Title}
        `;

        option.addEventListener('click', () => {
            dropdown.classList.remove('is-active');
            input.value = movie.Title;
            onMovieSelect(movie);
        });

        resultsWrapper.appendChild(option);
    }
};

// debouncing onInput function to reduce number of requests sent on user inputs
input.addEventListener('input', debounce(onInput, 500));

document.addEventListener('click', event => {
    if(!root.contains(event.target)){
        dropdown.classList.remove('is-active');
    }
});

const onMovieSelect = async movie => {
    const response = await axios.get('http://www.omdbapi.com/', {
        params: {
            apikey: '77b3dd9d',
            i: movie.imdbID
        }
    });

    document.querySelector('#summary').innerHTML = movieTemplate(response.data)
}

const movieTemplate = movieDetails => {
    return `
    <article class="media">
    <figure class="media-left">
      <p class="image">
        <img src="${movieDetails.Poster}">
      </p>
    </figure>
    <div class="media-content">
      <div class="content">
        <h1>${movieDetails.Title}</h1>
        <h4>${movieDetails.Genre}</h4>
        <p>${movieDetails.Plot}</p>
      </div>
    </div>
   </article>
   <article class="notification is-primary">
  <p class="title">${movieDetails.Awards}</p>
  <div class="subtitle">Awards</div>
</article>
<article class="notification is-primary">
  <p class="title">${movieDetails.BoxOffice}</p>
  <div class="subtitle">Box Office</div>
</article>
<article class="notification is-primary">
  <p class="title">${movieDetails.MetaScore}</p>
  <div class="subtitle">Meta Score</div>
</article>
<article class="notification is-primary">
  <p class="title">${movieDetails.imdbRating}</p>
  <div class="subtitle">IMDB Rating</div>
</article>
<article class="notification is-primary">
  <p class="title">${movieDetails.imdbVotes}</p>
  <div class="subtitle">IMDB Votes</div>
</article>
    `
}