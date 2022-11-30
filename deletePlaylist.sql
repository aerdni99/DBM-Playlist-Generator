CREATE PROCEDURE deletePlaylist (
plid VARCHAR
)
LANGUAGE plpgsql
AS $function$
BEGIN
    DELETE FROM public."Playlists"
    WHERE id = plid;
END; $function$;

CALL deletePlaylist('1');

SELECT * FROM public."Playlists";