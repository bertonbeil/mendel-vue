<template>
  <div>
    <JqxGrid
      :theme="'material'"
      :width="getWidth"
      :source="dataAdapter"
      :columns="columns"
      :pageable="true"
      :autoheight="true"
      :sortable="true"
      :filterable="true"
      :altrows="true"
      :editable="true"
      :selectionmode="'multiplecellsadvanced'"
      :columngroups="columngroups"
    ></JqxGrid>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import JqxGrid from 'jqwidgets-scripts/jqwidgets-vue/vue_jqxgrid.vue'
import foo from 'jqwidgets-scripts'

@Component({ name: 'ReportStudies' })
export default class ReportStudies extends Vue {
    source: any
    getWidth: string = '99%'
    dataAdapter: any = new jqx.dataAdapter(this.source)
    columns: object[] = [
      { text: 'Product Name', columngroup: 'ProductDetails', datafield: 'ProductName', width: 250 },
      { text: 'Quantity per Unit', columngroup: 'ProductDetails', datafield: 'QuantityPerUnit', align: 'right', cellsalign: 'right' },
      { text: 'Unit Price', columngroup: 'ProductDetails', datafield: 'UnitPrice', align: 'right', cellsalign: 'right', cellsformat: 'c2' },
      { text: 'Units In Stock', datafield: 'UnitsInStock', cellsalign: 'right', /* cellsrenderer:  this.cellsrenderer, */ width: 100 },
      { text: 'Discontinued', columntype: 'checkbox', datafield: 'Discontinued', align: 'center' }
    ]
    columngroups: object[] = [
      { text: 'Product Details', align: 'center', name: 'ProductDetails' }
    ]

    beforeCreate () {
      this.source = {
        datatype: 'xml',
        datafields: [
          { name: 'ProductName', type: 'string' },
          { name: 'QuantityPerUnit', type: 'int' },
          { name: 'UnitPrice', type: 'float' },
          { name: 'UnitsInStock', type: 'float' },
          { name: 'Discontinued', type: 'bool' }
        ],
        root: 'Products',
        record: 'Product',
        id: 'ProductID',
        url: '../sampledata/products.xml'
      }
    }
}
</script>
