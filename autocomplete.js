// seprate file to make code easily reusable in other projects
const createAutoComplete = ({
    root, 
    renderOption, 
    onOptionSelect, 
    inputValue, 
    fetchData
}) => {
    root.innerHTML = `
        <label><b>Search</b></label>
        <input class="input">
        <div class="dropdown">
            <div class="dropdown-menu">
                <div class="dropdown-content results"></div>
            </div>
        </div>
    `
    const input = root.querySelector('.input');
    const dropdown = root.querySelector('.dropdown');
    const resultsWrapper = root.querySelector('.results');

    // Since this function is retriving data from an asyncrounous function it must also be treated as such as it is also awaiting that requested data
    const onInput = async event => {
        const items = await fetchData(event.target.value);

        if (!items.length){
            dropdown.classList.remove('is-active');
            return;

        }

        resultsWrapper.innerHTML = '';
        dropdown.classList.add('is-active')
        for(let item of items){
            const option = document.createElement('a');

            option.classList.add('dropdown-item')
            option.innerHTML = renderOption(item);

            option.addEventListener('click', () => {
                dropdown.classList.remove('is-active');
                input.value = inputValue(item);
                onOptionSelect(item);
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
}