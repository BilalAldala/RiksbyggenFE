import axios from 'axios';

const Axios = axios.create({
  baseURL: 'http://localhost:7071/api',
  withCredentials: false,
});

export { Axios };