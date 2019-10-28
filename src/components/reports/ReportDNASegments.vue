<template>
  <div>
    <h2 class="text-black font-bold mb-40">DNA Segments</h2>
      <JqxGrid
        class="mt-10"
        v-if="dataAdapter"
        :theme="'energyblue'"
        :width="getWidth"
        :source="dataAdapter"
        :columns="columns"
        :pageable="true"
        :autoheight="true"
        :sortable="true"
        :filterable="true"
        :altrows="true"
        :editable="true"
        :selectionmode="'multiplecellsadvanced'">
      </JqxGrid>
  </div>
</template>

<script>
import JqxGrid from 'jqwidgets-scripts/jqwidgets-vue/vue_jqxgrid.vue'
import { httpService } from '@/services/http.service'

export default {
  components: { JqxGrid },

  data: function () {
    return {
      getWidth: '99%',
      dataAdapter: null,
      columns: [
        { text: 'Assembly', datafield: 'assembly', width: '15%' },
        { text: 'Segment', datafield: 'segment', width: '15%', cellsalign: 'right' },
        { text: 'Version', datafield: 'segment_version', width: '10%', cellsalign: 'right' },
        { text: 'Status', datafield: 'status', width: '10%' },
        { text: 'Position', datafield: 'position', width: '15%', cellsalign: 'right' },
        { text: 'Length', datafield: 'segment_length', width: '15%', cellsalign: 'right' },
        { text: 'Value', datafield: 'value', columntype: 'textbox', width: '20%', sortable: false }
      ]
    }
  },

  beforeCreate: function () {
    this.$emit('loadOn')
    return httpService.get('query/dnafragments')
      .then((res) => {
        this.source = {
          localData: res.data.rows,
          datatype: 'array',
          datafields: [
            { name: 'assembly', type: 'String' },
            { name: 'designer', type: 'String' },
            { name: 'design_version', type: 'String' },
            { name: 'segment' },
            { name: 'position' },
            { name: 'segment_length' },
            { name: 'segment_version' },
            { name: 'status', type: 'String' },
            { name: 'value', type: 'String' }
          ]
        }
        // eslint-disable-next-line new-cap
        this.dataAdapter = new jqx.dataAdapter(this.source)
      })
      .catch(err => { throw new Error(err) })
      .finally(() => this.$emit('loadOff'))
  }
}
</script>
