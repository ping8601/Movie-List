const BASE_URL = "https://movie-list.alphacamp.io";
const INDEX_URL = BASE_URL + "/api/v1/movies/";
const POSTER_URL = BASE_URL + "/posters/";
const MOVIES_PER_PAGE = 12;

const movies = [];
let filteredMovies = [];

const dataPanel = document.querySelector("#data-panel");
const movieModal = document.querySelector("#movie-modal");
const searchFrom = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const paginator = document.querySelector("#paginator");
const changeMode = document.querySelector("#change-mode");

let mode = "card";

function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount / MOVIES_PER_PAGE);
  let pageHTML = "";
  for (let page = 1; page <= numberOfPages; page++) {
    pageHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`;
  }
  paginator.innerHTML = pageHTML;
}

function renderMovieListByList(data) {
  let listHTML = '<ul class="list-group list-group-flush">';

  data.forEach((item) => {
    listHTML += `<li class="list-group-item d-flex justify-content-between align-items-center">
      <span>${item.title}</span>
      <div>
        <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${item.id}">More</button>
        <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
      </div>
    </li>`;
  });

  listHTML += `</ul>`;
  dataPanel.innerHTML = listHTML;
}

function renderMovieListByCard(data) {
  let movieHTML = "";
  data.forEach((item) => {
    movieHTML += ` <div class="col-sm-3">
        <div class="mb-2 mt-2"> 
          <div class="card">
            <img src="${POSTER_URL + item.image
      }" class="card-img-top" alt="Movie Poster">
            <div class="card-body">
            <h5 class="card-title">${item.title}</h5>
            </div>
            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${item.id
      }">More</button>
              <button class="btn btn-info btn-add-favorite" data-id="${item.id
      }">+</button>
            </div>
          </div>
        </div >
      </div >`;
  });
  dataPanel.innerHTML = movieHTML;
}

function getMoviesByPage(page) {
  const data = filteredMovies.length > 0 ? filteredMovies : movies;
  const startIndex = (page - 1) * MOVIES_PER_PAGE;
  return data.slice(startIndex, startIndex + MOVIES_PER_PAGE);
}

function showMovieModal(id) {
  axios.get(INDEX_URL + id).then((response) => {
    const movieData = response.data.results;
    movieModal.innerHTML = `<div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="movie-modal-title">${movieData.title
      }</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body" id="movie-modal-body">
              <div class="row">
                <div class="col-sm-8" id="movie-modal-image">
                  <img src="${POSTER_URL + movieData.image}" alt="movie-poster"
                    class="img-fluid">
                </div>
                <div class="col-sm-4">
                  <p><em id="movie-modal-date">release date: ${movieData.release_date
      }</em></p>
                  <p id="movie-modal-description">${movieData.description}</p>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>`;
  });
}

function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem("favoriteMovies")) || [];
  const movie = movies.find((movie) => movie.id === id);

  if (list.some((movie) => movie.id === id))
    return alert("This movie is already in the favorite list!");

  list.push(movie);

  localStorage.setItem("favoriteMovies", JSON.stringify(list));
}

axios.get(INDEX_URL).then((response) => {
  // for (const movie of response.data.results) movies.push(movie)
  movies.push(...response.data.results);
  renderPaginator(movies.length);
  renderMovieListByCard(getMoviesByPage(1));
});

dataPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".btn-show-movie")) {
    showMovieModal(Number(event.target.dataset.id));
  } else if (event.target.matches(".btn-add-favorite")) {
    addToFavorite(Number(event.target.dataset.id));
  }
});

searchFrom.addEventListener("submit", function onSearchFormSubmitted(event) {
  event.preventDefault();
  const keyword = searchInput.value.trim().toLowerCase();
  filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(keyword)
  );

  if (filteredMovies.length === 0) {
    alert("Cannot find movie with the keyword: " + keyword);
  }

  if (mode === "card") renderMovieListByCard(getMoviesByPage(1));
  else renderMovieListByList(getMoviesByPage(1));

  renderPaginator(filteredMovies.length);
});

paginator.addEventListener("click", function onPaginatorClicked(event) {
  const activePage = document.querySelector(".page-item.active");
  if (event.target.tagName !== "A") return;
  if (activePage) activePage.classList.remove("active");
  event.target.parentElement.classList.add("active");
  const page = Number(event.target.dataset.page);
  if (mode === "card") renderMovieListByCard(getMoviesByPage(page));
  else renderMovieListByList(getMoviesByPage(page));
});

changeMode.addEventListener("click", function onChangeModeClicked(event) {
  if (event.target.id === "card-icon") {
    mode = "card";
    renderMovieListByCard(getMoviesByPage(1));
  } else if (event.target.id === "list-icon") {
    mode = "list";
    renderMovieListByList(getMoviesByPage(1));
  }
});
