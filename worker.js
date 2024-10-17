// Define constants
const LASTFM_USERNAME = 'YOUR_LASTFM_USERNAME';
const LASTFM_API_KEY = 'YOUR_LASTFM_API_KEY';
const CACHE_NAME = 'lastfm-cache';
const CACHE_TTL = 60; // 1 minute

// Function to handle caching (triggered by cron)
async function cacheLastfmData() {
  const apiUrl = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${LASTFM_USERNAME}&api_key=${LASTFM_API_KEY}&format=json&limit=1`;
  
  try {
    const apiResponse = await fetch(apiUrl);
    
    if (!apiResponse.ok) {
      throw new Error(`Failed to fetch data (status: ${apiResponse.status})`);
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
    
    const cache = await caches.open(CACHE_NAME);
    await cache.put('lastfm-data', new Response(JSON.stringify(simplifiedData), {
      headers: { 'Content-Type': 'application/json' },
    }), { expirationTtl: CACHE_TTL });
    
    console.log('Last.fm data cached successfully.');
  
  } catch (error) {
    console.error('Error caching Last.fm data:', error);
  }
}

// Function to handle fetch events (return cached response)
async function handleFetch(event) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match('lastfm-data');
  
  if (cachedResponse) {
    return cachedResponse;
  } else {
    return new Response('Cached response not available.', { status: 503 });
  }
}

// Event listeners
addEventListener('scheduled', (event) => {
  event.waitUntil(cacheLastfmData());
});

addEventListener('fetch', (event) => {
  event.respondWith(handleFetch(event));
});
