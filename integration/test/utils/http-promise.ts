import { request, RequestOptions } from 'http';

export const httpPromise = (url: string, options?: RequestOptions) =>
  new Promise((resolve, reject) => {
    const req = request(url, options || {}, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve(data));
      res.on('error', (err) => reject(err));
    });
    req.end();
  });
