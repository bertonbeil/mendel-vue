<template>
  <div>
    <h2 class="text-black font-bold mb-40">Order Details</h2>
        <JqxGrid class="mt-10" v-if="dataAdapter" :theme="'energyblue'" :width="getWidth" :source="dataAdapter" :columns="columns"
                 :pageable="true" :autoheight="true" :sortable="true" :filterable="true" :altrows="true"
                 :editable="true" :selectionmode="'multiplecellsadvanced'">
        </JqxGrid>
  </div>
    </template>
<script>
import JqxGrid from 'jqwidgets-scripts/jqwidgets-vue/vue_jqxgrid.vue'
import { httpService } from '@/services/http.service'

export default {
  components: {
    JqxGrid
  },
  data: function () {
    return {
      getWidth: '99%',
      dataAdapter: null,
      columns: [
        { text: 'Aggregated order', datafield: 'aggregated_order', width: '15%' },
        { text: 'Order', datafield: 'order_name', width: '15%' },
        { text: 'Description', datafield: 'description', width: '20%' },
        { text: 'Created By', datafield: 'created_by', width: '10%' },
        { text: 'Vendor', datafield: 'vendor', width: '5%' },
        { text: 'Assembly', datafield: 'assembly', width: '15%' },
        { text: 'Status', datafield: 'status', width: '10%' },
        { text: 'Date', datafield: 'date', width: '10%' }
      ]
    }
  },
  beforeCreate: function () {
    this.$emit('loadOn')
    return httpService.get('query/orderDetailsReport')
      .then((res) => {
        this.source = {
          localData: res.data.rows,
          datatype: 'array',
          datafields: [
            { name: 'aggregated_order', type: 'String' },
            { name: 'order_name', type: 'String' },
            { name: 'description', type: 'String' },
            { name: 'created_by', type: 'String' },
            { name: 'vendor', type: 'String' },
            { name: 'assembly', type: 'String' },
            { name: 'status', type: 'String' },
            { name: 'date', type: 'Date' }
          ]
        }
        this.dataAdapter = new jqx.dataAdapter(this.source)
      })
      .catch(err => { throw new Error(err) })
      .finally(() => this.$emit('loadOff'))
  }
}
</script>
