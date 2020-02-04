<template>
  <el-container id="app" class="h-full is-vertical">
    <router-view />
    <div v-if="v" class="absolute text-grey-dark version-indicator">beta: v{{v}}</div>
  </el-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { version } from '../package.json'

@Component({ name: 'App' })

export default class App extends Vue {
  v: string = ''

  created () {
    this.v = version
  }
}

</script>
