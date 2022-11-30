/*
    setup.sql

    SQL statements for setting up our tables for the playlist generator
*/
CREATE TABLE public."Songs"
(
    id character varying NOT NULL,
    name character varying NOT NULL,
    explicit boolean NOT NULL,
    danceability real NOT NULL,
    energy real NOT NULL,
    key integer NOT NULL,
    loudness double precision NOT NULL,
    mode boolean NOT NULL,
    speechiness real NOT NULL,
    acousticness real NOT NULL,
    instrumentalness double precision NOT NULL,
    liveness real NOT NULL,
    valence real NOT NULL,
    tempo double precision NOT NULL,
    duration_ms integer NOT NULL,
    year integer NOT NULL,
    CONSTRAINT "Songs_pkey" PRIMARY KEY (id)
)

CREATE TABLE public."Playlists"
(
    id character varying  NOT NULL,
    name character varying  NOT NULL,
    link character varying  NOT NULL,
    CONSTRAINT "Playlists_pkey" PRIMARY KEY (id)
)

CREATE TABLE public."Created_By"
(
    artist_name character varying  NOT NULL,
    song_id character varying  NOT NULL,
    CONSTRAINT "Created_By_pkey" PRIMARY KEY (artist_name, song_id),
    CONSTRAINT "Created_By_song_id_fkey" FOREIGN KEY (song_id)
        REFERENCES public."Songs" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

CREATE TABLE public."Playlist_Songs"
(
	playlist_id character varying NOT NULL,
	song_id character varying NOT NULL,
	index integer NOT NULL,
	FOREIGN KEY (playlist_id) REFERENCES public."Playlists" (id),
	FOREIGN KEY (song_id) REFERENCES public."Songs" (id),
	PRIMARY KEY (playlist_id, song_id)
)

