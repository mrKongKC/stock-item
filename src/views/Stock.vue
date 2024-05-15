<script setup>
import { onMounted, ref } from 'vue'
import stockApi from '../services/stock.js'

const tableLoading = ref(false)
const tableData = ref([])
const uniqueLocations = ref([])

// const handleTab = (event, rowIndex, column) => {
//   if (event.key === 'Tab') {
//     event.preventDefault() // prevent to going to next column

//     const columns = uniqueLocations.value || [] //declare column
//     console.log(columns)

//     let nextRowIndex = rowIndex + 1
//     let nextColumn = column

//     if (nextRowIndex >= tableData.value.length) {
//       // condition to fix the next value will go to the row
//       nextRowIndex = 0
//       nextColumn = columns[(columns.indexOf(column) + 1) % columns.length]
//     }

//     const nextInputId = `input-${nextRowIndex}-${nextColumn}` //declare the unique id
//     const nextInput = document.getElementById(nextInputId) // find input by unique id

//     if (nextInput) {
//       nextInput.focus() //focus element
//     }
//   }
// }

const handleTab = (event, rowIndex, column) => {
  if (event.key === 'Tab') {
    event.preventDefault() // prevent default tab behavior

    const columns = uniqueLocations.value
    let nextRowIndex = rowIndex + 1
    let nextColumn = column

    if (nextRowIndex >= tableData.value.length) {
      // if it's the last row, move to the next column
      nextRowIndex = 0
      nextColumn = columns[(columns.indexOf(column) + 1) % columns.length]
    }

    const nextInputId = `input-${nextRowIndex}-${nextColumn}`
    const nextInput = document.getElementById(nextInputId)

    if (nextInput) {
      nextInput.focus()
    }
  }
}

const getMaterialList = () => {
  tableLoading.value = true
  stockApi
    .getMaterialList()
    .then((res) => {
      const response = res
      const uniqueMaterials = [...new Set(response.map((item) => item.Material))]
      uniqueLocations.value = [...new Set(response.map((item) => item.Location))]

      tableData.value = uniqueMaterials.map((material) => {
        const row = { Material: material }
        uniqueLocations.value.forEach((location) => {
          const item = response.find(
            (mat) => mat.Material === material && mat.Location === location
          )
          row[location] = item ? item.QTY : 0
        })
        return row
      })
    })
    .finally(() => {
      tableLoading.value = false
    })
}

onMounted(() => {
  getMaterialList()
})
</script>

<template>
  <div class="stock-container">
    <el-table
      :data="tableData"
      class="main-table"
      row-class-name="extend-row"
      v-loading="tableLoading"
      max-height="80vh"
      :empty-text="' '"
      :style="{ height: tableLoading || tableData.length === 0 ? '350px' : '' }"
    >
      <template #empty v-if="!tableLoading">
        <div style="height: 70vh" class="flex-align-center justify-center">No Data</div></template
      >
      <el-table-column prop="Material" label="Material" align="center"></el-table-column>
      <el-table-column
        v-for="location in uniqueLocations"
        :key="location"
        :prop="location"
        :label="location"
        align="center"
        min-width="160"
      >
        <template #default="scoped">
          <el-input
            v-model="scoped.row[location]"
            :id="`input-${scoped.$index}-${location}`"
            @keydown="handleTab($event, scoped.$index, location)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="summary" label="Summary" min-width="160" align="center" fixed="right">
        <template #default="scoped">
          <el-input
            v-model="scoped.row.address"
            :id="'input-' + scoped.$index + '-address'"
            @keydown="handleTab($event, scoped.$index, 'address')"
          />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<style scoped lang="scss">
.stock-container {
  width: 100%;
  margin: 40px;

  .extend-row {
    td {
      padding-top: 20px !important;
      padding-bottom: 20px !important;
    }
  }

  .main-table {
    width: 100%;
    // height: 80vh;
  }
}
</style>
