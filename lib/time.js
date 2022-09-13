export function millisToMinutesAndSeconds(millis) {
    // Converts to 60 second intervals
    const minutes = Math.floor(millis / 60000);
    // Calculates the seconds
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    return seconds == 60
        ? minutes + 1 + ":00"
        : minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}

