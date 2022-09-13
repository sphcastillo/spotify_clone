import React from 'react';
import { useRecoilState } from 'recoil';
import { currentTrackIdState, isPlayingState } from '../atoms/songAtom';
import useSpotify from '../hooks/useSpotify';
import { millisToMinutesAndSeconds } from '../lib/time';


function Song({ order, track }) {

    const spotifyApi = useSpotify();
    const [currentTrack, setCurrentTrack] = useRecoilState(currentTrackIdState);
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);

    // triggers play/pause actions when the song is clicked
    const playSong = () => {
        setCurrentTrack(track.track.id);
        setIsPlaying(true);
        spotifyApi.play({
            // uris: way for Spotify to identify what song you're trying to play
            uris: [track.track.uri],
        })
    };
    return (
        <div 
            className="grid grid-cols-2 py-4 px-5 text-gray-500 rounded-lg hover:bg-gray-900 cursor-pointer text-sm md:text-base"
            onClick={playSong}
        >
            <div className="flex items-center space-x-4">
                <p>{order + 1}</p>
                <img 
                    className="h-10 w-10"
                    src={track.track.album.images[0].url} 
                    alt="Album Image" 
                />
                <div>
                    <p className="w-36 lg:w-64 text-white truncate">{track.track.name}</p>
                    <p className="w-40">{track.track.artists[0].name}</p>
                </div>
            </div>

            <div className="flex items-center justify-between ml-auto md:ml-0">
                <p className="hidden md:inline">{track.track.album.name}</p>
                <p className="">{millisToMinutesAndSeconds(track.track.duration_ms)}</p>
            </div>
        </div>
    )
}

export default Song