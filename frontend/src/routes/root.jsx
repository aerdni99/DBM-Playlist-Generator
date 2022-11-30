import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import '../css/root.css';

function RangeComponent({ name, control, min, max, step }) {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field }) => (
                <Slider
                    className="range"
                    range
                    // value={value}
                    min={min}
                    max={max}
                    defaultValue={[min, max]}
                    step={step}
                    // onChange={(value) => {
                    //     onChange(value);
                    // }} 
                    {...field}
                />
            )}
        />
    );
};

export default function Root() {
    const [playlists, setPlaylists] = useState([]);
    const { register, handleSubmit, control, formState: { errors } } = useForm();

    const onSubmit = data => {
        const { artists } = data;
        if (artists === "") data.artists = undefined;
        else data.artists = data.artists.split(',');

        fetch('/playlists', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        }).then(() => window.location.reload());
    };

    const deletePlaylist = (id) => {
        return () => {
            fetch(`/playlists/${id}`, { method: 'DELETE' })
                .then(() => window.location.reload());
        }
    }

    useEffect(() => {
        fetch('/playlists')
            .then(res => res.json())
            .then(_playlists => setPlaylists(_playlists));
    });

    const playlistDivs = playlists.reduce((prev, playlist) => {
        prev.push(
            <div key={playlist.id}>
                <Link to={`/${playlist.id}`}>
                    {playlist.name}
                </Link>
                <button onClick={deletePlaylist(playlist.id)}>Delete</button>
            </div>
        );
        return prev;
    }, []);

    return (
        <div className="root">
            <h1>Playlist Generator</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input type="text" placeholder={errors.playlist_name ? 'Name required' : ''} {...register("playlist_name", { required: true })} />
                Playlist Name
                <br />
                <input defaultValue={1000} {...register('num_songs')} />
                Number of Songs (MAX: 1000)
                <br />
                <input {...register('artists')} />
                Artists (Separate artists by comma)
                <br />
                <label>
                    <input type="checkbox" placeholder="explicit" {...register("explicit", {})} />
                    Include Explicit?
                </label>
                <br />
                <br />
                <label className='rangeLabel'>Dance</label>
                <RangeComponent
                    name={'dance'}
                    control={control}
                    min={0}
                    max={1}
                    step={0.1}
                />
                <label className='rangeLabel'>Energy</label>
                <RangeComponent
                    name={'energy'}
                    control={control}
                    min={0}
                    max={1}
                    step={0.1}
                />
                <label className='rangeLabel'>Tempo</label>
                <RangeComponent
                    name={'tempo'}
                    control={control}
                    min={0}
                    max={300}
                    step={1}
                />
                <label className='rangeLabel'>Valence</label>
                <RangeComponent
                    name={'valence'}
                    control={control}
                    min={0}
                    max={1}
                    step={0.1}
                />
                <br />
                <input type="submit" />

            </form>
            <h3>Playlists</h3>
            {playlistDivs || 'loading'}
        </div>
    );
}   