import http from 'k6/http';


export const options = {
    scenarios:
    {
        normal_user:{
            executor: "per-vu-iterations",
            vus: 100,
            iterations: 10,
        },
        bad_user:{
            executor: "per-vu-iterations",
            vus: 10,
            iterations: 10,
        }
    }
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
