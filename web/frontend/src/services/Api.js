// FILE: <project>/frontend/src/services/Api.js

import axios from 'axios'
import { protocol, baseUrl } from './ConnectionData.js'

export default () => {
  return axios.create({
    baseURL: protocol + baseUrl
  })
}
