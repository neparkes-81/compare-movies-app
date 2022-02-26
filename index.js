const autoCompleteConfig = {
    renderOption(movie){
        const imgSRC = movie.Poster === 'N/A' ? '' : movie.Poster;
        return `
            <img src="${imgSRC}">
            ${movie.Title} (${movie.Year})
        `;
    },
    inputValue(movie){
        return movie.Title;
    },
    async fetchData(searchTerm) {
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
};

createAutoComplete({
    ...autoCompleteConfig,
    root: document.querySelector('#left-autocomplete'),
    onOptionSelect(movie){
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movie, document.querySelector('#left-summary'));
    }
})
createAutoComplete({
    ...autoCompleteConfig,
    root: document.querySelector('#right-autocomplete'),
    onOptionSelect(movie){
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movie, document.querySelector('#right-summary'));
    }
})

const onMovieSelect = async (movie, summaryElement) => {
    const response = await axios.get('http://www.omdbapi.com/', {
        params: {
            apikey: '77b3dd9d',
            i: movie.imdbID
        }
    });

    summaryElement.innerHTML = movieTemplate(response.data)
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