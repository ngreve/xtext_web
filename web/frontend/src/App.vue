<template>
  <!-- FILE: <project>/frontend/src/App.vue -->
  <div id="app">
    <div class="content">
      <!-- ATTENTION: data-editor-xtext-lang has to
           contain your language FILE EXTENSION -->
      <div id="xtext-editor" :data-editor-xtext-lang="this.dslFileExtenstion"></div>
    </div>
  </div>
</template>

<script>
import { protocol, baseUrl } from '@/services/ConnectionData.js'

export default {
  name: 'App',
  data () {
    return {
      xtextEditor: null,
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
    }
  }
}
</script>

<style>
html
, body
, #app {
  height: 100%;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.content {
  position: relative;
  width: 45%;
  height: 80%;
}

#xtext-editor {
  position: relative;
  height: 100%;
  border: 1px solid #aaa;
}
</style>
