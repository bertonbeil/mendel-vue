<template>
  <el-container id="app" class="h-full is-vertical">
    <router-view />
    <div class="absolute text-grey-dark version-indicator">beta: v0.9.2</div>
  </el-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({ name: 'App' })

export default class App extends Vue {

}

</script>
