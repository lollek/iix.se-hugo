import * as params from '@params';

var fuse;
var posts = document.querySelector('.home-posts');
var pagination = document.getElementById('postsPagination');
var sInput = document.getElementById('searchInput');
var initialPosts = posts.innerHTML;

function reset() {
    sInput.value = '';
    posts.innerHTML = initialPosts;
    if (pagination) pagination.hidden = false;
}

function renderResults(results) {
    posts.replaceChildren();
    if (pagination) pagination.hidden = true;

    results.forEach(function (result) {
        posts.insertAdjacentHTML('beforeend', result.item.html);
    });
}

// Load the site's generated search index.
window.addEventListener('load', function () {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                var data = JSON.parse(xhr.responseText);
                if (data) {
                    // fuse.js options; check fuse.js website for details
                    var options = {
                        distance: 100,
                        threshold: 0.4,
                        ignoreLocation: true,
                        keys: [
                            'title',
                            'permalink',
                            'summary',
                            'content'
                        ]
                    };
                    if (params.fuseOpts) {
                        options = {
                            isCaseSensitive: params.fuseOpts.iscasesensitive ? params.fuseOpts.iscasesensitive : false,
                            includeScore: params.fuseOpts.includescore ? params.fuseOpts.includescore : false,
                            includeMatches: params.fuseOpts.includematches ? params.fuseOpts.includematches : false,
                            minMatchCharLength: params.fuseOpts.minmatchcharlength ? params.fuseOpts.minmatchcharlength : 1,
                            shouldSort: params.fuseOpts.shouldsort ? params.fuseOpts.shouldsort : true,
                            findAllMatches: params.fuseOpts.findallmatches ? params.fuseOpts.findallmatches : false,
                            keys: params.fuseOpts.keys ? params.fuseOpts.keys : ['title', 'permalink', 'summary', 'content'],
                            location: params.fuseOpts.location ? params.fuseOpts.location : 0,
                            threshold: params.fuseOpts.threshold ? params.fuseOpts.threshold : 0.4,
                            distance: params.fuseOpts.distance ? params.fuseOpts.distance : 100,
                            ignoreLocation: params.fuseOpts.ignorelocation ? params.fuseOpts.ignorelocation : true
                        }
                    }
                    fuse = new Fuse(data, options);
                }
            } else {
                console.log(xhr.responseText);
            }
        }
    };
    xhr.open('GET', "index.json");
    xhr.send();
});

sInput.addEventListener('input', function () {
    var query = this.value.trim();
    if (!query) {
        reset();
    } else if (fuse) {
        renderResults(fuse.search(query));
    }
});

document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && document.activeElement === sInput) {
        reset();
    }
});
