import ImageKit from '@imagekit/nodejs';

const client = new ImageKit({ privateKey: process.env.IMAGEKIT_PRIVATE_KEY });

export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const authParams = client.helper.getAuthenticationParameters();
    res.status(200).json(authParams);
  } catch {
    res.status(500).json({ error: 'Failed to generate upload authentication parameters' });
  }
}
