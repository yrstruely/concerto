import http from 'k6/http';
import { sleep, check } from 'k6';
import { Counter } from 'k6/metrics';

const data = JSON.parse(open("/results/data.json"));
console.log(data)

// A simple counter for http requests

export const requests = new Counter('http_reqs');

// you can specify stages of your test (ramp up/down patterns) through the options object
// target is the number of VUs you are aiming for

export const options = {
  stages: [
    { target: 5, duration: '10s' }
    //{ target: 15, duration: '5s' },
    //{ target: 0, duration: '5s' },
  ],
  thresholds: {
    requests: ['count < 100'],
  },
};

export default function () {
  // our HTTP request, note that we are saving the response to res, which can be accessed later

  const res = http.get(`https://gorest.co.in/public/v1/users/${data.id}`)

  sleep(1);

  const checkRes = check(res, {
    'status is 200': (r) => r.status === 200,
    'response body': (r) => r.body.indexOf(`${data.id}`) !== -1,
  });
}
