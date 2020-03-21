// FILE: <project>/frontend/src/services/CompilerService.js

import Api from '@/services/Api'

export default {
  compileCode (dslCode) {
    return Api().post('compile', {
      code: dslCode
    })
  }
}
