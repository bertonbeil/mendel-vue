import { Component, Vue } from 'vue-property-decorator'
import { capitalize } from './helpers'

/*  */
export const alertMixin = {
  methods: {
    alert ({ type, msg }: any) {
      return (this as any).$alert(`${msg}`, `${capitalize(type)}`, {
        type: type,
        confirmButtonText: 'OK',
        showClose: false,
        closeOnClickModal: false,
        closeOnPressEscape: false
      })
    }
  }
}

@Component
export class ForceRender extends Vue {
  renderComponent: boolean = true

  async forceRerender () {
    // Remove my-component from the DOM
    this.renderComponent = false
    await this.$nextTick()
    this.renderComponent = true
  }
}
