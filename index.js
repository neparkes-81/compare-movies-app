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
        onMovieSelect(movie, document.querySelector('#left-summary'), 'left');
    }
})
createAutoComplete({
    ...autoCompleteConfig,
    root: document.querySelector('#right-autocomplete'),
    onOptionSelect(movie){
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movie, document.querySelector('#right-summary'), 'right');
    }
})

let leftMovie;
let rightMovie;
const onMovieSelect = async (movie, summaryElement, side) => {
    const response = await axios.get('http://www.omdbapi.com/', {
        params: {
            apikey: '77b3dd9d',
            i: movie.imdbID
        }
    });

    summaryElement.innerHTML = movieTemplate(response.data)

    if(side === 'left') {
      leftMovie = response.data;
    } else {
      rightMovie = response.data;
    }

    if(leftMovie && rightMovie){
      runComparison();
    }
};

const runComparison = () => {
    const leftSideStats = document.querySelectorAll('#left-summary .notification');
    const rightSideStats = document.querySelectorAll('#right-summary .notification');

    leftSideStats.forEach((leftStat, index) => {
      const rightStat = rightSideStats[index];

      const leftSideValue = parseInt(leftStat.dataset.value);
      const rightSideValue = parseInt(rightStat.dataset.value);

      if(rightSideValue > leftSideValue){
        leftStat.classList.remove('is-primary');
        leftStat.classList.add('is-warning');
      } else {
        rightStat.classList.remove('is-primary');
        rightStat.classList.add('is-warning');
      }
    })
}

const movieTemplate = movieDetails => {
    const dollars = parseInt(movieDetails.BoxOffice.replace(/\$/g, '').replace(/,/g, ''));
    const metascore = parseInt(movieDetails.MetaScore);
    const imdbRating = parseFloat(movieDetails.imdbRating);
    const imdbVotes  = parseInt(movieDetails. imdbVotes.replace(/,/g, ''));
    const awards = movieDetails.Awards.split(' ').reduce((prev, word) => {
      const value = parseInt(word);

      if(isNaN(value)){
        return prev;
      } else {
        return prev + value;
      }
    }, 0);
    console.log(awards)

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
   <article data-value="${awards}" class="notification is-primary">
    <p class="title">${movieDetails.Awards}</p>
    <div class="subtitle">Awards</div>
  </article>
  <article data-value="${dollars}" class="notification is-primary">
    <p class="title">${movieDetails.BoxOffice}</p>
    <div class="subtitle">Box Office</div>
  </article>
  <article data-value="${metascore}" class="notification is-primary">
    <p class="title">${movieDetails.MetaScore}</p>
    <div class="subtitle">Meta Score</div>
  </article>
  <article data-value="${imdbRating}" class="notification is-primary">
    <p class="title">${movieDetails.imdbRating}</p>
    <div class="subtitle">IMDB Rating</div>
  </article>
  <article data-value="${imdbVotes}" class="notification is-primary">
    <p class="title">${movieDetails.imdbVotes}</p>
    <div class="subtitle">IMDB Votes</div>
  </article>
    `
}