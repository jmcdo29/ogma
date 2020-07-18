import { request } from 'http';

export const gqlPromise = (url: string, query: Record<string, unknown>) =>
  new Promise((resolve, reject) => {
    const req = request(
      url,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => resolve(data));
        res.on('error', (err) => reject(err));
      },
    );
    req.write(Buffer.from(JSON.stringify(query)));
    req.end();
  });
