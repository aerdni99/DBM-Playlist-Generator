const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.db_uri,
  ssl: {
    rejectUnauthorized: false,
  },
});

const app = express();

const port = 3000;

app.get('/', (req, res) => {
  res.send('Playlist-maker homepage');
});

app.get('/playlists', (req, res) => {
  pool.query('SELECT * FROM public."Playlist"', (err, results) => {
    if (err) {
      throw err;
    }

    res.status(200).json(results.rows);
  });
});
app.delete('/playlists', express.json(), (req, res) => {
  const { playlist_id } = req.body;

  pool.query('DELETE FROM Playlist WHERE playlist_id=' + playlist_id);

  res.end();
});
app.post('/playlists', express.json(), (req, res) => {
  const {
    num_songs, // max of 1000
    artists, // array of artists
    explicit,
    // below values are arrays formatted as [min,max]
    dance,
    energy,
    tempo,
    valence,
  } = req.body;

  // left part of natural join
  let artist_query;
  if (artists) {
    artist_query = artists.reduce((res, artist, i) => {
      res += 'artist_name = ' + artist;
      if (i != artists.length - 1) res += ' OR ';
    }, `SELECT * FROM Created_By WHERE `);
  }

  // right part of natural join
  let song_query_beginning = 'SELECT song_id, name FROM public."Songs" TABLESAMPLE SYSTEM_ROWS(' + num_songs + ')';
  let song_query = song_query_beginning + ' WHERE ';

  if (explicit) {
    song_query += 'explicit = ' + explicit + ' OR ';
  }

  // deal with ranges
  const add_range = (val, val_name) => {
    song_query += '(' + val_name + ' >= ' + val[0] + ' AND ' + val_name + ' <= ' + val[1] + ')' + ' OR ';
  };

  // iterate through ranges and ignore if null
  [
    [dance, 'danceability'],
    [energy, 'energy'],
    [tempo, 'tempo'],
    [valence, 'valence'],
  ].forEach(([category, category_string]) => {
    if (category) add_range(category, category_string);
  });

  // remove trailing OR
  if (song_query.slice(-3) === 'OR ') {
    song_query = song_query.substring(0, song_query.length - 4);
  }
  // if no trailing OR, that means no values were added and there's a trailing WHERE
  else {
    song_query = song_query_beginning;
  }

  let playlist_query;
  if (!artist_query) playlist_query = song_query;
  else playlist_query = artist_query + ' NATURAL JOIN ' + song_query;

  // res.send(playlist_query);

  console.log(playlist_query);

  pool.query(playlist_query, (err, results) => {
    res.status(200).json(results.rows);
  });
});
// app.put('/playlists')

app.listen(port, () => {
  console.log('listening on port 3000');
});
