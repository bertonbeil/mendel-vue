<template>
  <MainHeader />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import MainHeader from '@/components/layouts/MainHeader.vue'
@Component({
  name: 'App',
  components: { MainHeader }
})
export default class App extends Vue {

}
</script>
