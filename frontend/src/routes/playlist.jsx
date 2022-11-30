import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../css/playlist.css';

export default function Playlist() {
    const { playlist_id } = useParams();
    const [songs, setSongs] = useState([]);
    useEffect(() => {
        fetch(`/playlists/${playlist_id}`)
            .then(res => res.json())
            .then(_songs => setSongs(_songs));
    });

    const songDivs = songs.reduce((prev, song, index) => {
        prev.push(
            <div key={song.index}>
                {`${index + 1} ${song.name}`}
            </div>
        );
        return prev;
    }, []);

    return (
        <div className="playlists">
            {songDivs || 'loading'}
        </div>
    );
}