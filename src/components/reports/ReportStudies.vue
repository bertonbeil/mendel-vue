<template>
  <div>
    <h2 class="text-black font-bold mb-40">Studies</h2>
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
        { text: 'Study', datafield: 'study', align: 'center' },
        { text: 'Principal Investigator', datafield: 'principal_investigator', align: 'center' },
        { text: 'Project', datafield: 'project', align: 'center' },
        { text: 'Investigator', datafield: 'investigator', align: 'center' },
        { text: 'Assembly', datafield: 'assembly', align: 'center' }
      ]
    }
  },
  beforeCreate: function () {
    this.$emit('loadOn')
    return httpService.get('query/study')
      .then((res) => {
        this.source = {
          localData: res.data.rows,
          datatype: 'array',
          datafields: [
            { name: 'study', type: 'String' },
            { name: 'principal_investigator', type: 'String' },
            { name: 'project', type: 'String' },
            { name: 'investigator', type: 'String' },
            { name: 'assembly', type: 'String' }
          ]
        }
        this.dataAdapter = new jqx.dataAdapter(this.source)
      })
      .catch(err => { throw new Error(err) })
      .finally(() => this.$emit('loadOff'))
  }
}
</script>
