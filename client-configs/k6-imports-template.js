const PROJECT_DIR = '../'
import http from 'k6/http';
import { sleep, check } from 'k6';
import { Counter } from 'k6/metrics';
import encoding from 'k6/encoding';
import { jUnit, textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';
import dotenv from "k6/x/dotenv";
const env = dotenv.parse(open(PROJECT_DIR + '.env'))
const process = {
  env: env
}
const data = JSON.parse(open(PROJECT_DIR + "results/data.json"));
import { uuidv4 } from "https://jslib.k6.io/k6-utils/1.0.0/index.js";
import { URLSearchParams } from 'https://jslib.k6.io/url/1.0.0/index.js';
import { faker } from 'https://cdnjs.cloudflare.com/ajax/libs/Faker/3.1.0/faker.min.js';
