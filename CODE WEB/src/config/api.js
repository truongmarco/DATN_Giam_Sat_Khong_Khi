import axios from 'axios';

export const customAxios = axios.create({
  baseURL: 'https://datn-a5156-default-rtdb.asia-southeast1.firebasedatabase.app/',   
  timeout: 10000,
  // headers: {'X-Custom-Header': 'foobar'}
});
