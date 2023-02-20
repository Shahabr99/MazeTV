"use strict";

const $showsList = $("#shows-list");
const $episodesArea = $("#episodes-area");
const $searchForm = $("#search-form");

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(searchTerm) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  const res = await axios.get(
    `https://api.tvmaze.com/search/shows?q=${searchTerm}`
  );

  return res.data;
}

/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    const { id, name, summary } = show.show;

    const $show = $(
      `<div data-show="${id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img 
              src="${show.show.image.original}"
              alt="${name}" 
              class="w-25 mr-3">
           <div class="media-body">
             <h5 class="text-primary">${name}</h5>
             <div><small>${summary}</small></div>
             <button class="btn btn-outline-light bg-success btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>  
       </div>
      `
    );

    $showsList.append($show);
  }
}

/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $(".form-control").val();

  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});

/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */
$showsList.on("click", ".btn", async function (e) {
  const result = e.target.closest("#shows-list").firstElementChild;
  const id = result.dataset.show;
  console.log(id);
  getEpisodesOfShow(id);
});

async function getEpisodesOfShow(id) {
  console.log(id);
  const res = await axios.get(`https://api.tvmaze.com/shows/${id}/episodes`);
  populateEpisodes(res.data);
}

/** Write a clear docstring for this function... */

function populateEpisodes(episodes) {
  console.log(episodes);
  $episodesArea.css("display", "block");
  for (let episode of episodes) {
    $(`<li>Season${episode.number}: ${episode.name}</li>`).appendTo(
      "#episodes-list"
    );
  }
}
