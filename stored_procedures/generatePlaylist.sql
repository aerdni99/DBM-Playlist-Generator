/*
    generatePlaylist.sql

    The first creates a stored procedure for creating a playlist
 */

CREATE PROCEDURE generatePlaylist (
	numSongs			INT,
    artists             VARCHAR[],
    allowExplicit       BOOLEAN,
    danceMin            REAL,
    danceMax            REAL,
    energyMin           REAL,
    energyMax           REAL,
    keys                INT[],
    loudnessMin         DOUBLE PRECISION,
    loudnessMax         DOUBLE PRECISION,
    specifyMode         BOOLEAN,
    mode                BOOLEAN,
    speechinessMin      REAL,
    speechinessMax      REAL,
    acousticnessMin     REAL,
    acousticnessMax     REAL,
    instrumentalnessMin DOUBLE PRECISION,
    instrumentalnessMax DOUBLE PRECISION,
    livenessMin         REAL,
    livenessMax         REAL,
    valenceMin          REAL,
    valenceMax          REAL,
    tempoMin            DOUBLE PRECISION,
    tempoMax            DOUBLE PRECISION,
    durationMin         INT,
    durationMax         INT,
    yearMin             INT,
    yearMax             INT
)       
LANGUAGE plpgsql
AS $function$
BEGIN
	RAISE INFO 'hello';
    RAISE INFO '%', artists[1];
    RAISE INFO '%', artists[2];
	RAISE INFO '%', array_length(artists, 1);
    RAISE INFO '%', allowExplicit;
    RAISE INFO '%', danceMin;
    RAISE INFO '%', danceMax;

END; $function$;

CALL generatePlaylist(
	0,
    ARRAY['Kanye', 'Lil Wayne'],
    TRUE,
    0,
    0,
    0,
    0,
    ARRAY[0, 1, 2, 3],
    0,
    0,
    TRUE,
    TRUE,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0
);

DROP PROCEDURE generatePlaylist(
	numSongs			INT,
    artists             VARCHAR[],
    allowExplicit       BOOLEAN,
    danceMin            REAL,
    danceMax            REAL,
    energyMin           REAL,
    energyMax           REAL,
    keys                INT[],
    loudnessMin         DOUBLE PRECISION,
    loudnessMax         DOUBLE PRECISION,
    specifyMode         BOOLEAN,
    mode                BOOLEAN,
    speechinessMin      REAL,
    speechinessMax      REAL,
    acousticnessMin     REAL,
    acousticnessMax     REAL,
    instrumentalnessMin DOUBLE PRECISION,
    instrumentalnessMax DOUBLE PRECISION,
    livenessMin         REAL,
    livenessMax         REAL,
    valenceMin          REAL,
    valenceMax          REAL,
    tempoMin            DOUBLE PRECISION,
    tempoMax            DOUBLE PRECISION,
    durationMin         INT,
    durationMax         INT,
    yearMin             INT,
    yearMax             INT
)
