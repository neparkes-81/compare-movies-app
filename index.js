const fetchData = async (searchTerm) => {
    // when making nework requests this is asyncrous as we have to await a response
    const response = await axios.get('http://www.omdbapi.com/', {
        params: {
            apikey: '77b3dd9d',
            s: searchTerm
        }
    });
    return response.data.Search;
}
const input = document.querySelector('input');

// Since this function is retriving data from an asyncrounous function it must also be treated as such as it is also awaiting that requested data
const onInput = async event => {
    const movies = await fetchData(event.target.value);

};

// debouncing onInput function to reduce number of requests sent on user inputs
input.addEventListener('input', debounce(onInput, 500));