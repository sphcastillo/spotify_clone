import { useEffect } from 'react';
import { useSession, signIn } from "next-auth/react";

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
    clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
});

function useSpotify() {
    const { data: session, status } = useSession();

    useEffect(() => {

        if(session){
            // If Refresh access token didn't work, direct user to SignIn page to have them log in again
            if(session.error === "RefreshAccessTokenError"){
                signIn();
            }

            spotifyApi.setAccessToken(session.user.accessToken);
        }
    }, [session]);

    return spotifyApi;
}

export default useSpotify;