import React, { useCallback, useEffect, useState } from 'react';
import useSpotify from '../hooks/useSpotify';
import { useSession } from "next-auth/react";
import { useRecoilState } from 'recoil';
import { currentTrackIdState, isPlayingState } from '../atoms/songAtom';
import useSongInfo from '../hooks/useSongInfo';
import { HeartIcon, VolumeUpIcon as VolumeDownIcon } from '@heroicons/react/outline';
import { FastForwardIcon,PauseIcon, PlayIcon, ReplyIcon, RewindIcon, VolumeUpIcon, SwitchHorizontalIcon } from "@heroicons/react/solid";
import { debounce } from 'lodash';

function Player() {
    const spotifyApi = useSpotify();
    const { data: session, status } = useSession();
    // need current track that's waiting
    const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);
    // need to know if the song is playing
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
    const [volume, setVolume] = useState(50);

    // use hook to get song info
    const songInfo = useSongInfo();

    const fetchCurrentSong = () => {
        // if there's no song info
        if(!songInfo){
            spotifyApi.getMyCurrentPlayingTrack().then(data => {
                console.log("Now playing: ", data.body?.item);
                setCurrentTrackId(data.body?.item?.id);

                spotifyApi.getMyCurrentPlaybackState().then((data) => {
                    setIsPlaying(data.body?.is_playing);
                });

            })
        }
    };

    const handlePlayPause = () =>  {
        spotifyApi.getMyCurrentPlaybackState().then((data) => {
            // check if there's a song playing
            if(data.body.is_playing){
                spotifyApi.pause();
                setIsPlaying(false);
            } else {
                spotifyApi.play();
                setIsPlaying(true);
            }
        })
    }

    useEffect(() => {
        // if you have an access token but no current track id
        if(spotifyApi.getAccessToken()  && !currentTrackId){
            // fetch the song info 
            fetchCurrentSong();
            setVolume(50);
        }
    },  [currentTrackIdState, spotifyApi, session]);

    // we are going to have a useEffect that will update the volume
    // Debounce the volume - you make just one request to the API, instead of 
    useEffect(() => {
        //when the volume changes, update the volume
        if(volume > 0 && volume < 100){
            debouncedAdjustVolume(volume);
        }
    }, [volume]);

    // useCallback allows us to have a memorized function
    // create this function once
    // debounce the function - only call it once every 500ms
    const debouncedAdjustVolume = useCallback(
        // basically just like a normal useEffect
        debounce((volume) => {
            spotifyApi.setVolume(volume);
        }, 500), 
        []
    );

    return (
        <div className="h-24 bg-gradient-to-b from-black to-gray-900 text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8">
            {/* Left */}
            <div className="flex items-center space-x-4">
                <img 
                    className="hidden md:inline h-10 w-10"
                    src={songInfo?.album.images?.[0]?.url} 
                    alt="Song Album Image" 
                />
                <div>
                    <h3>{songInfo?.name}</h3>
                    <p>{songInfo?.artists?.[0]?.name}</p>
                </div>
            </div>  

            {/* Center */}
            <div className="flex items-center justify-evenly"> 
                <SwitchHorizontalIcon className="button" />
                <RewindIcon 
                    className="button" 
                    // onClick={() => spotifyApi.skipToPrevious()} -- The API isn't working
                />
                {isPlaying ? (
                    // if the song is playing, show the pause button
                    <PauseIcon 
                        className="button w-10 h-10" 
                        onClick={handlePlayPause}
                    />
                ) : (
                    // if the song is paused, show the play button
                    <PlayIcon 
                        className="button w-10 h-10" 
                        onClick={handlePlayPause}
                    />
                )}

                <FastForwardIcon 
                    // onClick={() => spotifyApi.skipToPrevious()} -- The API isn't working
                    className="button"
                />
                <ReplyIcon className="button" />
            </div>

            {/* Right */}
            <div className="flex items-center space-x-3 md:space-x-4 justify-end pr-5">
                <VolumeDownIcon 
                    className="button" 
                    onClick={()  => volume > 0 && setVolume(volume - 10)}
                />
                <input 
                    className="w-14 md:w-28 cursor-pointer"
                    type="range" 
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}   
                    min={0} 
                    max={100} 
                />
                <VolumeUpIcon 
                    className="button" 
                    onClick={()  => volume < 100 && setVolume(volume + 10)}
                />
            </div>
        </div>
    )
}

export default Player;