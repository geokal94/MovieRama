$(document).ready(async () => {
  await inTheaters();

  $("#searchText").on("change paste input", e => {
    let searchText = $("#searchText").val();

    let loadingOutput = ""
    loadingOutput = `
      <p>Loading...</p>
      `
    $("#loading-results").html(loadingOutput);

    searchMovies(searchText);
    e.preventDefault();
  });
});

inTheaters = async () => {
  $("#loading-in-theaters-movies").html(`<i class="fas fa-spinner fa-spin loading-icon"></i>`);
  await axios
    .get(
      "https://api.themoviedb.org/3/movie/now_playing?api_key=bc50218d91157b1ba4f142ef7baaa6a0"
    )
    .then(response => {
      console.log("response.data: ", response.data);
      let moviesNowPlaying = response.data.results;
      let output = "";
      $.each(moviesNowPlaying, async (index, movie) => {
        const {
          title,
          poster_path,
          release_date,
          vote_average,
          overview,
          genre_ids
        } = movie;

        var movie_id = movie.id;

        await axios.get('https://api.themoviedb.org/3/genre/movie/list?api_key=bc50218d91157b1ba4f142ef7baaa6a0')
          .then(response => {
            console.log('response.data of genres: ', response.data)
            const totalGenres = response.data.genres;
            const genres = totalGenres.filter(genre => {
              let found = genre_ids.find(requested_genre => {
                return requested_genre === genre.id;
              });
              return genre ? genre.id === found : 0
            })
            let genreNames = genres.map(a => a.name).join(', ');
            $("#loading-in-theaters-movies").html("");
            console.log('TITLE BEFORE PASS: ', title)
            console.log('movie id BEFORE PASS: ', movie_id)
            output += `
                <div class="row movie-row" onclick="openDetails('${movie_id}','${title}')">
                      <div class="movie-card col-md-3">
                      
                        <img src="https://image.tmdb.org/t/p/w200/${movie.poster_path}" class="movie-image" alt="...">
                      </div>
                      <div class="col-md-9 ">
                        <div class="card-body">
                          <h4 class="card-title">${movie.title}
                            <span class="genre-class">${genreNames}</span>
                          </h4>
                          <p class="card-text last-movie-row">
                            <i class="fab fa-calendar-check"></i>&nbsp ${movie.release_date}
                          <span class="rating"> <i class="fas fa-star rating-icon"></i> ${movie.vote_average} / 10</span></p>
                          <p class="card-text movie-overview">${movie.overview}</p>
                          
                          
                        </div>
                      </div>
                      </div>
                      </div>
                `;
          })
          .catch(err => {
            console.log('error in genres fetch: ', err)
          });

        $("#moviesNowPlaying").html(output);
      })
    })
    .catch(err => {
      console.log("error in fetch inTheaters(): ", err);
    });
};

searchMovies = async searchText => {
  let outerOutput = ""
  outerOutput = `
  <h3 class="segment-header">Search Results:</h3>
  <div id="moviesResults"></div>
  <p id="nowResultsFound"></p>
  <p id="loading-results"></p>
  `
  $("#container-if-searched").html(outerOutput);
  console.log('searchText before axios: ', searchText)

  $("#loading-results").html(`<i class="fas fa-spinner fa-spin loading-icon"></i>`);

  await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=bc50218d91157b1ba4f142ef7baaa6a0&query=${searchText}`)
    .then(response => {
      console.log('RESULTS OF SEARCH: ', response.data)
      if (!response.data.results.length) {
        $("#nowResultsFound").html("No movies found :(");
        $("#loading-results").html("");
      }
      let moviesSearched = response.data.results;
      let output = "";
      $.each(moviesSearched, async (index, movie) => {
        const {
          title,
          poster_path,
          release_date,
          vote_average,
          overview,
          genre_ids
        } = movie;
        console.log('UPPER GENRES START ')
        /* let genres = getGenres(movie.genre_ids);
        console.log('UPPER GENRES: ', genres) */
        /*------------------------------------------------------- */

        await axios.get('https://api.themoviedb.org/3/genre/movie/list?api_key=bc50218d91157b1ba4f142ef7baaa6a0')
          .then(response => {
            console.log('response.data of genres: ', response.data)
            const totalGenres = response.data.genres;
            const genres = totalGenres.filter(genre => {
              let found = genre_ids.find(requested_genre => {
                return requested_genre === genre.id;
              });
              return genre ? genre.id === found : 0
            })
            console.log('Final genres of this movie: ', genres)
            let genreNames = genres.map(a => a.name).join(', ');
            console.log('names of genres of the movie: ', genreNames)
            $("#loading-results").html("");
            output += `
                <div class="row movie-row" onclick="openDetails(title)">
                      <div class="movie-card col-md-3">
                      
                        <img src="https://image.tmdb.org/t/p/w200/${movie.poster_path}" class="movie-image" alt="...">
                      </div>
                      <div class="col-md-9 ">
                        <div class="card-body">
                          <h4 class="card-title">${movie.title}
                            <span class="genre-class">${genreNames}</span>
                          </h4>
                          <p class="card-text last-movie-row">
                            <i class="fab fa-calendar-check"></i>&nbsp ${movie.release_date}
                          <span class="rating"> <i class="fas fa-star rating-icon"></i> ${movie.vote_average} / 10</span></p>
                          <p class="card-text movie-overview">${movie.overview}</p>
                          
                          
                        </div>
                      </div>
                      </div>
                      </div>
                `;
          })
          .catch(err => {
            console.log('error in genres fetch: ', err)
          });

        $("#moviesResults").html(output);
      })
    })
    .catch(err => {
      $("#loading-results").html("");
      $("#nowResultsFound").html("No movies found :(");
      console.log("error in search fetch: ", err);
    });
};
openDetails = (movie_id, title) => {
  console.log('OPENED DETAILS');
  console.log('movie id: ', movie_id);
  console.log('movie title: ', title);
  // Get the modal
  var modal = document.getElementById("movieModal");

  // Get the <span> element that closes the modal
  var span = document.getElementById("#close");

  // When the user clicks on <span> (x), close the modal


  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
  let output = `<div class="modal-content">
      <span id="close" >&times;</span>
      <p>${title}</p>
    </div>
    `;

  $("#movieModal").html(output);
  modal.style.display = "block";
}