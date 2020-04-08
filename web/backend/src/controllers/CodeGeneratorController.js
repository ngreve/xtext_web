// FILE: <project>/backend/src/controllers/CodeGeneratorController.js
'use strict'

const config = require('../config')
const fsPromises = require('fs').promises
const path = require('path')
const { execSync } = require('child_process')
const uuidv4 = require('uuid').v4 // random UUID

module.exports = {
  async compileToJS (req, res) {
    /*
     * We prepare a temporary directory to use it as our working directory.
     * The name of this directory will be a automatic generated UUID.
     * The directory will be deleted after we've send the compiled code to the
     * user.
     * It is very unlikely that the  directory names will collide.
     */
    const tmpDir = path.resolve(path.dirname(config.paths.dslCompiler), uuidv4())
    try {
      if (!req.body.code) throw new Error('No code provided')
      // Create the temporary directory
      await fsPromises.mkdir(tmpDir)
      // Define where our dsl code will be at.
      const dslCodePath = path.resolve(tmpDir, `code.${config.dslFileExt}`)
      // Write the sent code to a file
      await fsPromises.writeFile(dslCodePath, req.body.code)
      // Run the compile: the argument is the path to the received code, which
      // we've wrote to a file. with cwd we tell the shell to use the tmpDir
      // As the working directory.
      const dslCompilerPath = path.resolve(process.cwd(), config.paths.dslCompiler)
      execSync(`java -jar ${dslCompilerPath} ${dslCodePath}`, { cwd: tmpDir })
      // After the execution of the command, the compiled code will be available
      // within <tmpDir>/src-gen/generated_code.js
      const generatedPath = path.resolve(tmpDir, 'src-gen', 'generated_code.js')
      // Read the generated JavaScript code ...
      const jsCode = await fsPromises.readFile(generatedPath, 'utf-8')
      // ... and send it back to the user
      await res.send({
        code: jsCode
      })
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: err
      })
    }
    // Clean up the directory ...
    await fsPromises.rmdir(tmpDir, { recursive: true })
  }
}
