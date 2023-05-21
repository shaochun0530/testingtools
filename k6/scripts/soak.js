import http from 'k6/http';


export const options = {
    stages: [
        { duration: '2m', target: 400 }, // ramp up to 400 users
        { duration: '7m', target: 400 }, // stay at 400 for ~4 hours
        { duration: '2m', target: 0 }, // scale down. (optional)
      ],
    thresholds: {
      http_req_duration: ['p(99)<1500'], // 99% of requests must complete below 1.5s
    },
};
export default function () {
  const url = 'http://test.k6.io/login';
  const payload = JSON.stringify({
    email: 'aaa',
    password: 'bbb',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  http.post(url, payload, params);
}
