addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const username = LASTFM_USERNAME;
  const apiKey = LASTFM_API_KEY;
  const apiUrl = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${apiKey}&format=json&limit=1`;

  try {
    const apiResponse = await fetch(apiUrl);

    if (!apiResponse.ok) {
      const errorData = await apiResponse.json();
      const errorMessage = errorData.message || 'Last.fm API error';
      throw new Error(`${errorMessage} (status: ${apiResponse.status})`);
    }

    const data = await apiResponse.json();

    const { name, artist, album, image, url } = data.recenttracks.track[0];
    const artworkUrl = image[2]['#text'];
    const simplifiedData = {
      name,
      artist: artist['#text'],
      album: album['#text'],
      artworkUrl,
      songUrl: url
    };

    return new Response(JSON.stringify(simplifiedData), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}
