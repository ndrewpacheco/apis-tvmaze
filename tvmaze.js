"use strict";

const $showsList = $("#shows-list");
const $episodesArea = $("#episodes-area");
const $searchForm = $("#search-form");
const $episodesList = $("#episodes-list");

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  const response = await axios.get(`http://api.tvmaze.com/search/shows`, {
    params: { q: term },
  });

  // returns first show from search and it's data
  return [
    response.data.map((res) => {
      const { show } = res;
      const { id, name, summary } = show;
      const defaultImg = "https://tinyurl.com/tv-missing";
      const image = show.image ? show.image.medium : defaultImg;

      return {
        id,
        name,
        summary,
        image,
      };
    })[0],
  ];
}

/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    const $show = $(
      `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img 
              src=${show.image} 
              alt=${show.name} 
              class="w-25 mr-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>  
       </div>
      `
    );
    // gets array of episodes when clicked
    $show.on("click", "button", async () => {
      const episodes = await getEpisodesOfShow(show.id);
      populateEpisodes(episodes);
    });
    $showsList.append($show);
  }
}
async function searchForShowAndDisplay() {
  const term = $("#search-query").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}
/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});

/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id) {
  const episodes = await axios.get(
    `http://api.tvmaze.com/shows/${id}/episodes`
  );

  return episodes.data;
}

/** Write a clear docstring for this function... */

// given an array of episode data, displays each episode's info within the epsiodeList
function populateEpisodes(episodes) {
  for (let episode of episodes) {
    const $ep = `<li>${episode.name} (season ${episode.season}, number ${episode.number})</li>`;
    $episodesList.append($ep);
  }
  $episodesArea.show();
}
