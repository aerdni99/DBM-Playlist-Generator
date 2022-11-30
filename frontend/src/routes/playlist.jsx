import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';


export default function Playlist() {
    const { playlist_id } = useParams();
    const [songs, setSongs] = useState([]);
    useEffect(() => {
        fetch(`/playlists/${playlist_id}`)
            .then(res => res.json())
            .then(_songs => setSongs(_songs));
    });

    const songDivs = songs.reduce((prev, song) => {
        prev.push(
            <div key={song.index}>
                {song.name}
            </div>
        );
        return prev;
    }, []);

    return (
        <>
            {songDivs || 'loading'}
        </>
    );
}