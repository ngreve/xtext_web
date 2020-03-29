<template>
  <!-- FILE: <project>/frontend/src/App.vue -->
  <div id="app">
    <div id="controls">
      <!-- Click on "Run" triggers the compiling process -->
      <button
        @click="compileToJS"
      >
        Run
      </button>
    </div>
    <div class="content">
      <div id="xtext-editor" :data-editor-xtext-lang="this.dslFileExtenstion"></div>
    </div>
  </div>
</template>

<script>
import { protocol, baseUrl } from '@/services/ConnectionData.js'
import ConsoleView from '@/components/ConsoleView'
import CompilerService from '@/services/CompilerService'

export default {
  name: 'App',
  components: {
      ConsoleView
  },
  data () {
    return {
      xtextEditor: null,
      scriptContainer: null,
      dslFileExtenstion: ''
    }
  },
  mounted () {
    /* If the _xtext object is not null when we mount this component, we can continue to configure our editor, otherwise we will wait for the 'ready' event */
    (!window._xtext) ? window.xtextReadyEvent.on('ready', this.setXtextEditor) : this.setXtextEditor()
  },
  methods: {
    setXtextEditor () {
      /* The serviceUrl contains the URL, on which
         the language server is reachable */
      this.dslFileExtenstion = window._dslFileExtenstion

      /* We have to wait untill rendering of this.dslFileExtenstion
        in data-editor-xtext-lang attribute finishes
        before we initialize the editor */
      this.$nextTick(() => {
        this.xtextEditor = window._xtext.createEditor({
          baseUrl: '/',
          serviceUrl: `${protocol}${baseUrl}xtext-service`,
          syntaxDefinition: `xtext-resources/generated/mode-${this.dslFileExtenstion}.js`,
          enableCors: true
        })
      })
    },
    async compileToJS () {
      try {
        // Take the editor content and send it to the backend
        const response = await CompilerService.compileCode(this.xtextEditor.getValue())
        const compiledCode = response.data.code
        // Execute the compiled code
        this.runCompiledCode(compiledCode)
      } catch (err) {
        console.error(err.error)
      }
    },
    runCompiledCode (compiledCode) {
      try {
        const headDOM = document.getElementsByTagName('head')[0]
        // Remove prior created script DOM if one exists
        if (this.scriptContainer)
          headDOM.removeChild(this.scriptContainer);

        // Create a script DOM which will contain the compiled code
        this.scriptContainer = document.createElement('script')
        this.scriptContainer.innerHTML = `
        try {
          async function run() {
              ${compiledCode}
          }
          run()
        } catch (err) {
          console.error('COMPILED CODE ERROR:', err)
        }
        `
        // Appending the script DOM to the head will lead to autmatic execution
        // of the appended script DOM
        headDOM.appendChild(this.scriptContainer)
      } catch (err) {
        console.error(err)
      }
    }
  }
}
</script>

<style>
html
, body
, #app {
  height: 100%;
  margin: 0;
  padding: 0;
}

body {
  align-items: center;
  justify-content: center;
  display: flex;
  width: 100%;
}

#app {
  display: flex;
  width: 100%;
  flex-direction: column;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 90%;
  justify-content: center;
  align-items: center;
}

#controls,
.content {
  width: 90%;
}

.content {
  display: flex;
  min-height: 100%;
}

#xtext-editor {
  position: relative;
  height: 100%;
  width: 100%;
  border: 1px solid #aaa;
}

#console-view {
  position: relative;
  width: 100%;
  height: 100%;
  border: 1px solid #aaa;
}
</style>
