<template>
  <el-container id="app" class="h-full is-vertical bg">
    <router-view />
  </el-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({ name: 'App' })

export default class App extends Vue {

}

</script>
