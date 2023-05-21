import http from 'k6/http';
import { Trend } from 'k6/metrics';
import { check, sleep } from 'k6';

export const options = {
    scenarios:
    {
        normal_user:{
            executor: "per-vu-iterations",
            vus: 100,
            iterations: 1,
            env: { DATE_SEARCH: '2020-10-29' },
        },
        bad_user:{
            executor: "per-vu-iterations",
            vus: 10,
            iterations: 1,
            env: { DATE_SEARCH: '2020-10-29' },
        }
    },  
    thresholds: {
      'checks{scenario:normal_user}': ['rate>0.95'], // <5% errors
      'checks{scenario:bad_user}': ['rate>0.95'],
  },
  summaryTrendStats: ['avg', 'min', 'med', 'max', 'p(90)', 'p(95)', 'p(99)', 'count'],
};

// const myTrend = new Trend('my_trend');
let customMetrics = {};

for (let key in options.scenarios) {
  // Add the scenario name as an environment variable
  console.log(key);
  options.scenarios[key].env['MY_SCENARIO'] = key;
  // You can customize the actual name in any way you want, by using other env
  // vars, etc.
  // Create a new custom Trend metric for the scenario.
  customMetrics[key] = new Trend(key, true);
}

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
  

  let res = http.post(url, payload, params);
  check(res, { 'status is 200': (r) => r.status === 200 }, { my_tag: "I'm a tag" });

  //myTrend.add(res.timings.connecting, { my_tag: "I'm a tag" });
  customMetrics[__ENV.MY_SCENARIO].add(res.timings.duration);
  customMetrics[__ENV.MY_SCENARIO].add(res.status);
}
