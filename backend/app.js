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
  
  // select songs from Songs table
  let song_query = 'SELECT song_id, name FROM (public."Songs"';

  // select songs based on artists (Created_By table)
  let artist_query;
  if (artists) {
    artist_query = artists.reduce((res, artist, i) => {
      res += 'artist_name = ' + artist;
      if (i != artists.length - 1) res += ' OR ';
    }, `SELECT * FROM Created_By WHERE `);
    song_query += ' NATURAL JOIN ' + artist_query;
  }
  ') TABLESAMPLE SYSTEM_ROWS(' + num_songs + ')';

  let playlist_query = song_query + ' WHERE ';

  if (explicit) {
    playlist_query += 'explicit = ' + explicit + ' OR ';
  }

  // function to deal with ranges
  const add_range = (val, val_name) => {
    playlist_query += '(' + val_name + ' >= ' + val[0] + ' AND ' + val_name + ' <= ' + val[1] + ')' + ' OR ';
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
  if (playlist_query.slice(-3) === 'OR ') {
    playlist_query = playlist_query.substring(0, playlist_query.length - 4);
  }
  // if no trailing OR, that means no values were added and there's a trailing WHERE
  else {
    playlist_query = song_query;
  }

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
