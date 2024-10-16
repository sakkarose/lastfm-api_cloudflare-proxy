// Cloudflare Worker code (lastfm-proxy)
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const username = LASTFM_USERNAME;
  const apiKey = LASTFM_API_KEY;
  const apiUrl = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${apiKey}&format=json&limit=1`;

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData.message || 'Last.fm API error';
      throw new Error(`${errorMessage} (status: ${response.status})`);
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'max-age=60', // Cache for 60 seconds
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
