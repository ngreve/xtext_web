// FILE: <project>/backend/src/services/LanguageServerService.js
'use-strict'

const { spawn } = require('child_process')
const path = require('path')

module.exports = {
  async startLanguageServer (languagePath) {
    return new Promise(function (resolve, reject) {
      const baseDir = path.dirname(path.resolve(languagePath))
      try {
        const ls = spawn(`java -jar ${languagePath}`, {
          shell: true,
          cwd: baseDir
        })

        ls.stdout.on('data', (data) => {
          console.log(`stdout: ${data}`)
        })

        ls.stderr.on('data', (data) => {
          // Waiting for the string that indicates the successfull start
          if (/(.)*INFO(.)*Server started(.)*/.test(data)) {
            resolve()
          }
        })

        ls.on('close', (code) => {
          if (code !== 0) {
            throw new Error(`Error: language server exited with code: ${code}\nHINT: Try to wait ~10 sec before next start. This gives the system the necessary time for it's cleanup processes.`)
          }
        })
      } catch (err) {
        reject(err)
      }
    })
  }
}
