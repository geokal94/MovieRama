var resultsPageToBeSearched = 1;
$(document).ready(async () => {
  await inTheaters();

  var pageToBeSearched = 1;

  $("#searchText").on(" paste input", e => {
    let searchText = $("#searchText").val();

    let loadingOutput = "";
    loadingOutput = `
      <p>Loading...</p>
      `;
    $("#loading-results").html(loadingOutput);
    searchMovies(searchText);
    e.preventDefault();
  });

  $(window).scroll(function() {
    if ($(window).scrollTop() + $(window).height() == $(document).height()) {
      loadMore(++pageToBeSearched);
    }
  });
});

inTheaters = async () => {
  $("#loading-in-theaters-movies").html(
    `<i class="fas fa-spinner fa-spin loading-icon"></i>`
  );

  await axios
    .get(
      "https://api.themoviedb.org/3/movie/now_playing?api_key=bc50218d91157b1ba4f142ef7baaa6a0"
    )
    .then(response => {
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

        await axios
          .get(
            "https://api.themoviedb.org/3/genre/movie/list?api_key=bc50218d91157b1ba4f142ef7baaa6a0"
          )
          .then(response => {
            const totalGenres = response.data.genres;
            const genres = totalGenres.filter(genre => {
              let found = genre_ids.find(requested_genre => {
                return requested_genre === genre.id;
              });
              return genre ? genre.id === found : 0;
            });
            let genreNames = genres.map(a => a.name).join(", ");
            $("#loading-in-theaters-movies").html("");

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
            console.log("error in genres fetch: ", err);
          });

        $("#moviesNowPlaying").html(output);
      });
    })
    .catch(err => {
      console.log("error in fetch inTheaters(): ", err);
    });
};

searchMovies = async searchText => {
  let outerOutput = "";
  outerOutput = `
  <h3 class="segment-header">Search Results:</h3>
  <div id="moviesResults"></div>
  <p id="nowResultsFound"></p>
  <p id="loading-results"></p>
  <button class="btn btn-secondary btn-block" onclick="loadMoreSearches('${searchText}')">Show More Results</button>
  `;
  $("#container-if-searched").html(outerOutput);

  $("#loading-results").html(
    `<i class="fas fa-spinner fa-spin loading-icon"></i>`
  );

  await axios
    .get(
      `https://api.themoviedb.org/3/search/movie?api_key=bc50218d91157b1ba4f142ef7baaa6a0&query=${searchText}`
    )
    .then(response => {
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

        var movie_id = movie.id;

        await axios
          .get(
            "https://api.themoviedb.org/3/genre/movie/list?api_key=bc50218d91157b1ba4f142ef7baaa6a0"
          )
          .then(response => {
            const totalGenres = response.data.genres;
            const genres = totalGenres.filter(genre => {
              let found = genre_ids.find(requested_genre => {
                return requested_genre === genre.id;
              });
              return genre ? genre.id === found : 0;
            });

            let genreNames = genres.map(a => a.name).join(", ");

            $("#loading-results").html("");
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
            console.log("error in genres fetch: ", err);
          });

        $("#moviesResults").html(output);
      });
    })
    .catch(err => {
      $("#loading-results").html("");
      $("#nowResultsFound").html("No movies found :(");
      console.log("error in search fetch: ", err);
    });
};
openDetails = async (movie_id, title) => {
  var modal = document.getElementById("movieModal");

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  let initialOutput = `<div class="zoomIn animated modal-content" >
      <h3 class="card-title" style="display:block;">${title}<span class="close">&times;</span></h3>
      <i id="loading-modal-content"></i>
      <div id="modalInnerContent"></div>
    </div>
    `;

  $("#movieModal").html(initialOutput);
  modal.style.display = "block";

  var span = document.getElementsByClassName("close")[0];

  span.onclick = function() {
    modal.style.display = "none";
  };

  $("#loading-modal-content").html(
    `<i class="fas fa-spinner fa-spin loading-icon loading-modal"></i>`
  );

  let reviews = [];
  let total_reviews;
  let video;
  let videoTitles;

  await axios
    .get(
      `https://api.themoviedb.org/3/movie/${movie_id}/videos?api_key=bc50218d91157b1ba4f142ef7baaa6a0`
    )
    .then(response => {
      if (!response.data.results.length) {
        video = "No video available";
      } else {
        if (response.data.results.length === 1) {
          video = `${response.data.results.length} video available`;
        } else {
          video = `${response.data.results.length} videos available`;
        }

        videoTitles = response.data.results.map((video, index) => {
          video.name = ` ${index + 1}) ` + video.name;
          return video.name;
        });
      }
    })
    .catch(err => {
      console.log("error in video request: ", err);
    });

  await axios
    .get(
      `https://api.themoviedb.org/3/movie/${movie_id}/reviews?api_key=bc50218d91157b1ba4f142ef7baaa6a0`
    )
    .then(response => {
      total_reviews = response.data.results.length;
      if (!response.data.results.length) {
        reviews = "No reviews for this movie";
      } else if (response.data.results.length <= 2) {
        reviews = response.data.results.map(review => {
          review.content += "<br><br>";
          return review.content;
        });
      } else {
        reviews = response.data.results.map((review, index) => {
          while (index < 2) {
            review.content += "<br><br>";
            return review.content;
          }
        });
      }
    })
    .catch(err => {
      console.log("error in openDetails request: ", err);
    });

  await axios
    .get(
      `https://api.themoviedb.org/3/movie/${movie_id}/similar?api_key=bc50218d91157b1ba4f142ef7baaa6a0`
    )
    .then(response => {
      if (!response.data.results.length) {
        similarMovies = "No similar movies";
      } else {
        similarMovies = response.data.results.map(movie => {
          movie.title = " " + movie.title;
          return movie.title;
        });
      }
    })
    .catch(err => {
      console.log("error in similar movies request: ", err);
    });

  $("#loading-modal-content").html("");

  let output = `
      <h5 class="inner-heading">Reviews (${total_reviews})</h5>
      <p style="color:black;" class="review">${reviews}</p>
      <h5 class="inner-heading">Similar Movies</h5>
      <p class="similar-movies">${similarMovies}</p>
      <h5 class="inner-heading">Videos</h5>
      <p ><b style="color:black; text-decoration:underline;">${video}:</b> <i style="color:black; font-size:20px;">${videoTitles}</i></p>
    `;

  $("#modalInnerContent").html(output);
};

loadMore = async page => {
  $("#loading-more-movies").html(
    `<i class="fas fa-spinner fa-spin loading-icon"></i>`
  );
  await axios
    .get(
      `https://api.themoviedb.org/3/movie/now_playing?api_key=bc50218d91157b1ba4f142ef7baaa6a0&page=${page}`
    )
    .then(response => {
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

        await axios
          .get(
            "https://api.themoviedb.org/3/genre/movie/list?api_key=bc50218d91157b1ba4f142ef7baaa6a0"
          )
          .then(response => {
            const totalGenres = response.data.genres;
            const genres = totalGenres.filter(genre => {
              let found = genre_ids.find(requested_genre => {
                return requested_genre === genre.id;
              });
              return genre ? genre.id === found : 0;
            });
            let genreNames = genres.map(a => a.name).join(", ");
            $("#loading-more-movies").html("");
            output = `
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
            $("#moviesNowPlaying").append(output);
          })
          .catch(err => {
            console.log("error in load more genres fetch: ", err);
          });
      });
    })
    .catch(err => {
      console.log("error in fetch loadMore(): ", err);
    });
};

loadMoreSearches = async searchText => {
  await axios
    .get(
      `https://api.themoviedb.org/3/search/movie/?api_key=bc50218d91157b1ba4f142ef7baaa6a0&page=${++resultsPageToBeSearched}&query=${searchText}`
    )
    .then(response => {
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

        await axios
          .get(
            "https://api.themoviedb.org/3/genre/movie/list?api_key=bc50218d91157b1ba4f142ef7baaa6a0"
          )
          .then(response => {
            const totalGenres = response.data.genres;
            const genres = totalGenres.filter(genre => {
              let found = genre_ids.find(requested_genre => {
                return requested_genre === genre.id;
              });
              return genre ? genre.id === found : 0;
            });
            let genreNames = genres.map(a => a.name).join(", ");

            output = `
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
            $("#moviesResults").append(output);
          })
          .catch(err => {
            console.log("error in load more genres fetch: ", err);
          });
      });
    })
    .catch(err => {
      console.log("error in fetch loadMore(): ", err);
    });
};
