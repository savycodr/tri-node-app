// Load the NPM Package inquirer
// This package will be used to ask the user to chose their options
var inquirer = require("inquirer");

// Create a "Prompt" with a question.
inquirer
  .prompt([
    // Here we give the user a list to choose from.
    {
      type: "list",
      message: "Which action you choose?",
      choices: ["concert-this", "spotify-this-song", "movie-this", "do-what-it-says"],
      name: "action"
    }
  ])
  .then(function(inquirerResponse) {

    if (inquirerResponse.action === "concert-this"){
        inquirer
        .prompt([
          // Here we give the user a list to choose from.
          {
            type: "input",
            message: "What is the name of the band?",
            name: "bandName"
          }
        ])
        .then(function(bandResponse) {
          // concert-this code goes here
          console.log("The band name is " + bandResponse.bandName);
        });
    } else if (inquirerResponse.action === "spotify-this-song"){
      inquirer
      .prompt([
        // Here we give the user a list to choose from.
        {
          type: "input",
          message: "What is the name of the song?",
          name: "songName"
        }
      ])
      .then(function(songResponse) {
        // spotify code goes here
        console.log("The song name is " + songResponse.songName);
      });
    } else if (inquirerResponse.action === "movie-this"){
      inquirer
      .prompt([
        // Here we give the user a list to choose from.
        {
          type: "input",
          message: "What is the name of the movie?",
          name: "movieName"
        }
      ])
      .then(function(movieResponse) {
        // OMDB code goes here
        console.log("The movie name is " + movieResponse.movieName);

        // If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'
        if ((movieResponse.movieName==="") || (movieResponse.movieName===undefined))
        {
          movieResponse.movieName = "Mr.+Nobody"; 
        }


        console.log("The movie name is " + movieResponse.movieName);
        //    * Title of the movie.
        //    * Year the movie came out.
        //    * IMDB Rating of the movie.
        //    * Rotten Tomatoes Rating of the movie.
        //    * Country where the movie was produced.
        //    * Language of the movie.
        //    * Plot of the movie.
        //    * Actors in the movie.
        var axios = require("axios");

        // Then run a request with axios to the OMDB API with the movie specified
        axios.get("http://www.omdbapi.com/?t=" +movieResponse.movieName + "&y=&plot=short&apikey=trilogy").then(
          function(response) {
            console.log(JSON.stringify(response.data, null, 2));
            // first some error handling
            if (response.data.Response === "False")
            {
              console.log("Sorry, the movie " + movieResponse.movieName + " was not found, try another one.");
              return;
            }
            console.log(JSON.stringify(response.data, null, 2));
            console.log("Title: " + response.data.Title);
            console.log("Year: " + response.data.Year);
            console.log("IMDB Rating: " + response.data.imdbRating);
            // need to parse array of ratings to find the Rotten Tomatoes one
            ratings = response.data.Ratings;
            var rtRating = "";
            for (var i=0; i<ratings.length; i++){
              if (ratings[i].Source === "Rotten Tomatoes")
              rtRating = ratings[i].Value;
            }
            console.log("Rotten Tomatoes Rating: " + rtRating);
            console.log("Country: " + response.data.Country);
            console.log("Language: " + response.data.Language);
            console.log("Plot: " + response.data.Plot);
            console.log("Actors: " + response.data.Actors);
          });// end of axios call then
      });// end of omdb prompt then
    } else if (inquirerResponse.action === "do-what-it-says"){
           
      // fs code goes here
      console.log("We will need to read a file. ");

    }

  }); // end of multiple choice, select action then