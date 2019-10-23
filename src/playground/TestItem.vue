<template>
  <div> <slot></slot> </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component({ name: 'TestItems' })

export default class TestItems extends Vue {

}
 </script>  