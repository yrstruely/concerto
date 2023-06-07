

const getPostsConfig = getPosts()

const createPostParams = {
  userId: 1,
  title: "delectus aut autem",
  completed: false
}
const createPostConfig = createPost(createPostParams)

export const requests = new Counter('http_reqs');

export const options = {
  stages: [
    { target: 5, duration: '10s' },
    /* { target: 45, duration: '10s' },
    { target: 0, duration: '10s' } */
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(90)<30000'],
    checks: ['rate>0.99']
  },
};

export default function () {

  const requests = {
    'GET posts': {
      method: getPostsConfig.method,
      url: getPostsConfig.url,
      params: {
        headers: getPostsConfig.headers
      }
    },
    'POST create post': {
      method: createPostConfig.method,
      url: createPostConfig.url,
      body: JSON.stringify(createPostConfig.data),
      params: {
        headers: createPostConfig.headers
      }
    }
  }

  const responses = http.batch(requests);
  // when accessing results, we use the name of the request as index
  // in order to find the corresponding Response object
  check(
    responses['GET posts'], {
    'status is 200': (res) => res.status === 200
  })

  check(
    responses['POST create post'], {
    'status is 201': (res) => res.status === 201,
    'Id returned successfully': (r) => JSON.parse(r.body).id === 101
  })

  sleep(1);
}

export function handleSummary(data) {
  console.log('Preparing the end-of-test summary...');

  return {
    'stdout': textSummary(data, { indent: ' ', enableColors: true }), // Show the text summary to stdout...
    './results/performance/junit.xml': jUnit(data), // but also transform it and save it as a JUnit XML...
    './results/performance/summary.json': JSON.stringify(data) // and a JSON with all the details...
    // And any other JS transformation of the data you can think of,
    // you can write your own JS helpers to transform the summary data however you like!
  };
}