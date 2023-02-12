require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:

app.get("/", (req, res, next) => {
  res.render("home.hbs");
});

app.get("/artist-search", (req, res, next) => {
  const { artist } = req.query;
  spotifyApi
    .searchArtists(artist)
    .then((response) => {
      res.render("artist", {
        artists: response.body.artists.items,
      });
      console.log(response.body.artists.items);
    })
    .catch((error) => {
      next(error);
    });
});

app.get("/albums/:id", (req, res, next) => {
  const { id } = req.params;
  console.log(id);
  spotifyApi
    .getArtistAlbums(id)
    .then((response) => {
      res.render(
        "albums.hbs",
        {
          albums: response.body.items,
        }
      );
      console.log(response.body.items);
    })
    .catch((error) => {
      next(error);
    });
});

app.get("/tracks/:id", (req, res, next) => {
  const { id } = req.params
  console.log(id)
  spotifyApi.getAlbumTracks(id)
  .then((response) => {
    res.render("tracks.hbs", {
      tracks: response.body.items
    })
    console.log(response.body.items[0].preview_url)
  })
  .catch((error) => {
    next(error);
  })
})

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
