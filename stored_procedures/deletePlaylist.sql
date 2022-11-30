-- 3 statements here:

--  The first creates a stored procedure for deleting a playlist by id
--  The second calls the procedure
--  The third ...

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