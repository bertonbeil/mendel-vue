<template>
  <div class="p-100">
    <div class="w-1/2">
      <el-button type="primary" class="mb-20" @click="increment('a')">Increment</el-button>
      <p>{{ foo.a }}</p>
    </div>

    <div class="w-1/2">
      <el-button type="primary" class="mb-20" @click="increment('b')">Increment</el-button>
      <p>{{ foo.b }}</p>
    </div>

    <div>Total: {{ total }}</div>

    <div class="mt-20">{{ title }}</div>

    <div class="my-20">Sate number: {{ storeNumber }}</div>
    <div class="w-1/3">
      <el-button type="primary" class="mb-20" @click="incrementState">Increment</el-button>
    </div>
    <div class="w-1/3">
      <el-button type="primary" class="mb-20" @click="emitEvemnt">emitEvemnt</el-button>
    </div>
    <div class="w-1/3">
      <el-button type="primary" class="mb-20" @click="emitProps">emitProps</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop } from 'vue-property-decorator'

@Component({
  name: 'Test'
})

export default class Test extends Vue {
  @Prop({ required: true, default: () => 'Default title' }) title!: string

  data = 'data'
  foo: any = {
    a: 0,
    b: 0
  }

  increment (value: any) {
    this.foo[value]++

    this.data = 'foo'

    console.log('totla: ', this.total)
  }

  incrementState () {
    this.$store.dispatch('incrementNumber', this.storeNumber + 1)
  }

  get total () {
    return this.foo.a + this.foo.b
  }

  get storeNumber () {
    return this.$store.state.number
  }

  emitEvemnt () {
    this.$emit('custom', 'data')
  }

  emitProps () {
    this.$emit('update:title', 'new title')
  }

  @Watch('foo', { deep: true })
  hanldeFooChange (newValue: number, oldValue: number) {
    console.log('old: ', oldValue, 'new: ', newValue)
  }

  created () {
    console.log('created!')
    console.log('data: ', this.data)
  }
}
</script>
