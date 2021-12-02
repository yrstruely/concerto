import http from 'k6/http';
import { sleep, check } from 'k6';
import { Counter } from 'k6/metrics';
import { html, jUnit, textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';

import dotenv from "k6/x/dotenv";

const env = dotenv.parse(open(".env.develop.local"));

const data = JSON.parse(open("./results/data.json"));
console.log(data)

// A simple counter for http requests

export const requests = new Counter('http_reqs');

// you can specify stages of your test (ramp up/down patterns) through the options object
// target is the number of VUs you are aiming for

export const options = {
  stages: [
    { target: 5, duration: '10s' },
    { target: 15, duration: '10s' },
    { target: 0, duration: '10s' }
  ],
  thresholds: {
    requests: ['count < 100'],
  },
};

export default function () {
  // our HTTP request, note that we are saving the response to res, which can be accessed later

  const uri = `${env.GO_REST_BASE_URL}${env.GO_REST_URL_PATH}`
  console.log(uri)
  const res = http.get(`${uri}/users/${data.id}`)

  sleep(1);

  const checkRes = check(res, {
    'status is 200': (r) => r.status === 200,
    'response body': (r) => r.body.indexOf(`${data.id}`) !== -1,
  });
}


export function handleSummary(data) {
  console.log('Preparing the end-of-test summary...');

  return {
    'stdout': textSummary(data, { indent: ' ', enableColors: true }), // Show the text summary to stdout...
    './results/performance/junit.xml': jUnit(data), // but also transform it and save it as a JUnit XML...
    './results/performance/summary.json': JSON.stringify(data), // and a JSON with all the details...
    './results/performance/summary.html': html(data)
    // And any other JS transformation of the data you can think of,
    // you can write your own JS helpers to transform the summary data however you like!
  };
}