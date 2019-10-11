$(document).ready(async () => {
  await inTheaters();
  $('[data-toggle="popover"]').popover({
    placement: "top",
    trigger: "hover"
  });
  $("#searchForm").on("submit", e => {
    let searchText = $("#searchText").val();
    searchMovies(searchText);
    e.preventDefault();
  });
});

inTheaters = () => {
  axios
    .get(
      "https://api.themoviedb.org/3/movie/now_playing?api_key=bc50218d91157b1ba4f142ef7baaa6a0"
    )
    .then(response => {
      console.log("response.data: ", response.data);
      let moviesNowPlaying = response.data.results;
      let output = "";
      $.each(moviesNowPlaying, (index, movie) => {
        output += `
        <div class="row movie-row">
              <div class="movie-card col-md-3">
               
                <img src="https://image.tmdb.org/t/p/w200/${movie.poster_path}" class="movie-image" alt="...">
              </div>
              <div class="col-md-9 ">
                <div class="card-body">
                  <h4 class="card-title">${movie.title}</h4>
                  <p class="card-text">${movie.overview}</p>
                  <p class="card-text last-movie-row">Release Date: ${movie.release_date}<span class="rating">Rating: ${movie.vote_average} / 10</span></p>
                  
                </div>
              </div>
               </div>
               </div>
        `;
      });

      $("#moviesNowPlaying").html(output);
    })
    .catch(err => {
      console.log("error in fetch inTheaters(): ", err);
    });
};

searchMovies = searchText => {
  console.log("searched: ", searchText);
  let output = "";
  $("#moviesResults").html(output);
  output += `
    <div class="container">
      <h1 class="segment-header">Search Results:</h1>

                    <h5 class="card-text">${searchText}</h5>

    </div>
  `;

  $("#moviesResults").html(output);
};
