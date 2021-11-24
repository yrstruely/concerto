import http from 'k6/http';
import { sleep, check } from 'k6';
import { Counter } from 'k6/metrics';

// A simple counter for http requests

export const requests = new Counter('http_reqs');

// you can specify stages of your test (ramp up/down patterns) through the options object
// target is the number of VUs you are aiming for

export const options = {
  stages: [
    { target: 20, duration: '5s' },
    { target: 15, duration: '5s' },
    { target: 0, duration: '5s' },
  ],
  thresholds: {
    requests: ['count < 100'],
  },
};

export default function () {
  // our HTTP request, note that we are saving the response to res, which can be accessed later

  //const res = http.get('https://test.k6.io');
  const res = http.get('https://gorest.co.in/public/v1/users/404')

  sleep(1);

  const checkRes = check(res, {
    'status is 404': (r) => r.status === 404,
    'response body': (r) => r.body.indexOf('Resource not found') !== -1,
  });
}
