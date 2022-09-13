// to keep track of what songs are playing 
import { atom } from 'recoil';

// this will tell us what song is playing by its id
export const currentTrackIdState = atom({
    // unique ID, with respect to other atoms/selectors
    key: 'currentTrackIdState',
    // default value (aka initial value)
    default: null,
});

// if you're playing a song, it's true
// if  you're not playing a song, it's false
export const isPlayingState = atom({
    key: 'isPlayingState',
    default: false,
});

