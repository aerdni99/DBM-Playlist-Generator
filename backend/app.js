const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const { param } = require('express/lib/request');
require('dotenv').config();

const pool = new Pool({
  database: process.env.db,
  host: 'localhost',
  user: process.env.user,
  password: process.env.password,
  port: process.env.port,
  ssl: false
});

const app = express();
const port = 4000;

app.use(cors());


// app.get('/', (req, res) => {
//   res.send('Playlist-maker homepage');
// });

app.get('/playlists', (req, res) => {
  return res.status(200).json([
    { name: 'test' }, { name: 'balh' }, { name: 'asdf' }
  ]);
  pool.query('SELECT * FROM public."Playlists"', (err, results) => {
    if (err) {
      throw err;
    }

    res.status(200).json(results.rows);
  });
});
app.delete('/playlists', express.json(), (req, res) => {
  const { playlist_id } = req.body;

  pool.query('DELETE FROM Playlists WHERE playlist_id=' + playlist_id);

  res.end();
});
app.post('/playlists', express.json(), (req, res) => {
  console.log(req.body);
  const {
    num_songs = 1000, // max of 1000
    artists, // array of artists
    explicit,
    playlist_name,
    // below values are arrays formatted as [min,max]
    dance,
    energy,
    tempo,
    valence,
  } = req.body;

  // select songs from Songs table
  let song_query = 'SELECT id, name FROM public."Songs"';

  // select songs based on artists (Created_By table)
  if (artists) {
    let artist_query = artists.reduce((res, artist, i) => {
      res += `artist_name = '` + artist + `'`;
      if (i != artists.length - 1) res += ' OR ';
      return res;
    }, `(SELECT * FROM public."Created_By" WHERE `);
    song_query += ' s INNER JOIN ' + artist_query + `) c ON c.song_id = s.id`;
  }

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
  playlist_query += ' ORDER BY RANDOM() LIMIT ' + num_songs;

  console.log(playlist_query);

  pool.query(playlist_query, (err, results) => {
    // res.status(200).json(results.rows);
    const songs = results.rows;
    if (songs.length === 0) {
      return res.status(400).send("No songs found");
    }

    pool.query('INSERT INTO public."Playlists" (name, link) VALUES ($1, $2) RETURNING id', [playlist_name, 'TBD'])
      .then(insertRes => {
        const parameters = [];
        const playlist_id = insertRes.rows[0].id;

        let count = 1;
        let insert_query = songs.reduce((prev, song) => {
          prev += `($${count}, $${count + 1}, $${count + 2}),`;
          parameters.push(playlist_id, song.id, (count - 1) / 3);
          count += 3;
          return prev;
        }, 'INSERT INTO "Playlist_Songs" (playlist_id, song_id, index) VALUES ');
        // remove trailing comma
        insert_query = insert_query.slice(0, -1);

        pool.query(insert_query, parameters)
          .then(
            () => res.status(200).send('inserted')
          );
      });
  });
});
// app.put('/playlists')

app.listen(port, () => {
  console.log('listening on port ' + port);
});
