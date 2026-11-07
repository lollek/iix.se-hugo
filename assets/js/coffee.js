const controls = document.querySelector('[data-coffee-controls]');
const search = document.querySelector('#coffee-search');
const rating = document.querySelector('#coffee-rating');
const results = document.querySelector('[data-coffee-results]');
const groups = [...document.querySelectorAll('[data-coffee-group]')];

function filterCoffees() {
    const query = search.value.trim().toLocaleLowerCase();
    let total = 0;

    for (const group of groups) {
        let count = 0;
        for (const item of group.querySelectorAll('[data-coffee-item]')) {
            const matchesRating = rating.value === 'all' || item.dataset.rating === rating.value;
            const matchesSearch = item.textContent.toLocaleLowerCase().includes(query);
            item.hidden = !matchesRating || !matchesSearch;
            if (!item.hidden) count += 1;
        }
        group.hidden = count === 0;
        group.querySelector('[data-coffee-count]').textContent = count;
        total += count;
    }

    results.textContent = total === 0 ? 'No coffees found.' : `${total} ${total === 1 ? 'coffee' : 'coffees'}`;
}

search.addEventListener('input', filterCoffees);
rating.addEventListener('change', filterCoffees);
controls.hidden = false;
results.hidden = false;
filterCoffees();