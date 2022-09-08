const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'

const dataPanel = document.querySelector('#data-panel')
const movieModal = document.querySelector('#movie-modal')
const searchFrom = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')

const movies = JSON.parse(localStorage.getItem('favoriteMovies'))

function renderMovieList(data) {
  let rawHTML = ''
  data.forEach((item) => {
    rawHTML +=
      ` <div class="col-sm-3">
        <div class="mb-2 mt-2"> 
          <div class="card">
            <img src="${POSTER_URL + item.image}" class="card-img-top" alt="Movie Poster">
            <div class="card-body">
            <h5 class="card-title">${item.title}</h5>
            </div>
            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${item.id}">More</button>
              <button class="btn btn-danger btn-delete-favorite" data-id="${item.id}">x</button>
            </div>
          </div>
        </div >
      </div >`
  })
  dataPanel.innerHTML = rawHTML
}

function showMovieModal(id) {
  axios.get(INDEX_URL + id)
    .then((response) => {
      const movieData = response.data.results
      movieModal.innerHTML =
        `<div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="movie-modal-title">${movieData.title}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body" id="movie-modal-body">
              <div class="row">
                <div class="col-sm-8" id="movie-modal-image">
                  <img src="${POSTER_URL + movieData.image}" alt="movie-poster"
                    class="img-fluid">
                </div>
                <div class="col-sm-4">
                  <p><em id="movie-modal-date">release date: ${movieData.release_date}</em></p>
                  <p id="movie-modal-description">${movieData.description}</p>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>`
    })
}

function deleteFromFavorite(id) {
  const movieIndex = movies.findIndex(movie => movie.id === id)

  movies.splice(movieIndex, 1)

  localStorage.setItem('favoriteMovies', JSON.stringify(movies))
  renderMovieList(movies)
}

renderMovieList(movies)

dataPanel.addEventListener('click', function onPanelClick (event) {
  if (event.target.matches('.btn-show-movie')) {
    showMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-delete-favorite')) {
    deleteFromFavorite(Number(event.target.dataset.id))
  }
})