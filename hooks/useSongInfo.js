// when you fetch the tracks, it gives you infomation about the current track
// when you play a song, it gives you information in another way
// both give you an id
// we need to create a hook
import React, { useEffect, useState } from 'react';
import useSpotify from "./useSpotify";
import { useRecoilState } from 'recoil';
import { currentTrackIdState } from "../atoms/songAtom";

function useSongInfo() {
    const spotifyApi = useSpotify();
    const [currentIdTrack, setCurrentIdTrack] = useRecoilState(currentTrackIdState);
    const [songInfo, setSongInfo] = useState(null);

    useEffect(() => {
        const fetchSongInfo = async () => {
            if(currentIdTrack){
                const trackInfo = await fetch(
                    `https://api.spotify.com/v1/tracks/${currentIdTrack}`,
                    {
                        headers: {
                            Authorization: `Bearer ${spotifyApi.getAccessToken()}`,
                        }
                    }
                ).then(res => res.json());

                setSongInfo(trackInfo);
            }
        }

        fetchSongInfo();

    }, [currentIdTrack, spotifyApi]);
    return songInfo;
}

export default useSongInfo