import https from 'https';

const urls = [
  'https://videos.pexels.com/video-files/5013305/5013305-hd_1920_1080_30fps.mp4',
  'https://videos.pexels.com/video-files/5013309/5013309-hd_1920_1080_30fps.mp4',
];

function checkUrl(url) {
  return new Promise((resolve) => {
    const parsedUrl = new URL(url);
    const options = {
      hostname: parsedUrl.hostname,
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Range': 'bytes=0-100'
      }
    };
    
    https.request(options, (res) => {
      resolve({ url, statusCode: res.statusCode });
    }).on('error', (err) => {
      resolve({ url, error: err.message });
    }).end();
  });
}

Promise.all(urls.map(checkUrl)).then(console.log);
