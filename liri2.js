// Load the NPM Package inquirer
// This package will be used to ask the user to chose their options
var inquirer = require("inquirer");

// Create a "Prompt" with a question.
inquirer.prompt([
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
        inquirer.prompt([
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
          writeConcertInfo(bandResponse.bandName);
        });
    } else if (inquirerResponse.action === "spotify-this-song"){
      inquirer.prompt([
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
        writeSongInfo(songResponse.songName);
      });
    } else if (inquirerResponse.action === "movie-this"){
      inquirer.prompt([
        // Here we give the user a list to choose from.
        {
          type: "input",
          message: "What is the name of the movie?",
          name: "movieName"
        }
      ])
      .then(function(movieResponse){
          // OMDB code goes here
          writeMovieInfo(movieResponse.movieName);
      });

    } else if (inquirerResponse.action === "do-what-it-says"){
           
      // fs code goes here
      console.log("We will need to read a file. ");

    }

  }); // end of multiple choice prompt (select action) then


// This function makes a APEX call to the OMDB API 
// and reads the response and writes the results to the screen.
function writeMovieInfo(mvName){
    console.log("The movie name is " + mvName);

    // If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'
    if ((mvName==="") || (mvName===undefined))
    {
        mvName = "Mr.+Nobody"; 
    }

    console.log("The movie name is " + mvName);
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
    axios.get("http://www.omdbapi.com/?t=" + mvName + "&y=&plot=short&apikey=trilogy").then(
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
  }


// This will search the Bands in Town Artist Events API ("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp") for an artist and render the following information about each event to the terminal:
// Name of the venue
// Venue location
// Date of the Event (use moment to format this as "MM/DD/YYYY")
// https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp

function writeConcertInfo(bName){
  // Grab the axios package...
  var axios = require("axios");
  // Grab the moment package
  var moment = require("moment");
  // Run the axios.get function...
  // The axios.get function takes in a URL and returns a promise (just like $.ajax)
  var concertURL = "https://rest.bandsintown.com/artists/" + bName + "/events?app_id=codingbootcamp";
  axios.get(concertURL).then(function(cResponse) {
    // If the axios was successful...
    // Then log the body from the site!
    console.log(cResponse.data);
    var concertResults = cResponse.data;
    console.log("The number of results are " + concertResults.length);
    for (var i=0; i<concertResults.length; i++){
      console.log("Venue Name: " + concertResults[i].venue.name);
      console.log("Venue Location: " + concertResults[i].venue.city);
      // date format is returned from api as 2019-09-21T19:00:35
      // use moment to format this as "MM/DD/YYYY"
      var concertDate = concertResults[i].datetime.split("T")[0];
      concertDate = moment(concertDate, "YYYY-MM-DD").format("MM/DD/YYYY");
      console.log("Date: " + concertDate + "\n");
    }
  })
  .catch(function(cError) {
    if (cError.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range 
      console.log(cError.response.data);
      console.log(cError.response.status);
      console.log(cError.response.headers);
    } else if (cError.request) {
      // The request was made but no response was received
      // `error.request` is an object that comes back with details pertaining to the error that occurred.
      console.log(cError.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log("Error", cError.message);
    }
    console.log(cError.config);

  });


}

// spotify-this-song
// This will show the following information about the song in your terminal/bash window
// Artist(s)
// The song's name
// A preview link of the song from Spotify
// The album that the song is from
// If no song is provided then your program will default to "The Sign" by Ace of Base.
function writeSongInfo(sName)
{
  // read and set any environment variables with the dotenv package:
  require("dotenv").config();

  // Grab the node-spotify-api package...
  var nodeSpotify = require("node-spotify-api");

  // Add the code required to import the keys.js file and store it in a variable.
  var keys = require("./keys.js");

  // You should then be able to access your keys information like so  
  var spotify = new Spotify(keys.spotify);


}

