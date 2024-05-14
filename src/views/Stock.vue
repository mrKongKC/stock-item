<script setup>
import { ref } from 'vue'

const tableData = ref([
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  }
])

const handleTab = (event, rowIndex, column) => {
  if (event.key === 'Tab') {
    event.preventDefault() // prevent to going to next column

    const columns = ['date', 'name', 'address'] //declare column
    let nextRowIndex = rowIndex + 1
    let nextColumn = column

    if (nextRowIndex >= tableData.value.length) {
      // condition to fix the next value will go to the row
      nextRowIndex = 0
      nextColumn = columns[(columns.indexOf(column) + 1) % columns.length] 
    }

    const nextInputId = `input-${nextRowIndex}-${nextColumn}` //declare the unique id
    const nextInput = document.getElementById(nextInputId) // find input by unique id

    if (nextInput) {
      nextInput.focus() //focus element
    }
  }
}
</script>

<template>
  <div class="stock-container">
    <el-table :data="tableData" style="width: 100%" row-class-name="extend-row">
      <el-table-column prop="date" label="Date" min-width="180" align="center">
        <template #default="scoped">
          <input
            v-model="scoped.row.date"
            :id="'input-' + scoped.$index + '-date'"
            @keydown="handleTab($event, scoped.$index, 'date')"
          />
        </template>
      </el-table-column>
      <el-table-column prop="name" label="Name" min-width="180" align="center">
        <template #default="scoped">
          <input
            v-model="scoped.row.name"
            :id="'input-' + scoped.$index + '-name'"
            @keydown="handleTab($event, scoped.$index, 'name')"
          />
        </template>
      </el-table-column>
      <el-table-column prop="address" label="Address" min-width="180" align="center">
        <template #default="scoped">
          <input
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
}
</style>
