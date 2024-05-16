<script setup>
import { onMounted, ref } from 'vue'
import stockApi from '../services/stock.js'
import { Search } from '@element-plus/icons-vue'
import { Plus } from '@element-plus/icons-vue'

const search = ref('')
const tableLoading = ref(false)
const tableData = ref([])
const uniqueLocations = ref([])

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

const searchMaterial = () => {}

const getMaterialList = () => {
  tableLoading.value = true
  stockApi
    .getMaterialList()
    .then((res) => {
      const response = res
      const uniqueMaterials = [...new Set(response.map((item) => item.Material))].sort()
      uniqueLocations.value = [...new Set(response.map((item) => item.Location))].sort()

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

const sum = (row) => {
  let total = 0
  uniqueLocations.value.forEach((location) => {
    total += Number(row[location])
  })
  return total
}

const handleInput = (row, location) => {
  const nonDigitRegex = /[^0-9]/
  const removeFirstZero = /^0+[1-9]/
  if (!row[location]) {
    row[location] = 0
  } else if (nonDigitRegex.test(row[location])) {
    row[location] = row[location].toString().replace(/[^0-9]/g, '')
  } else if (removeFirstZero.test(row[location])) {
    row[location] = row[location].toString().replace(/^0+/, '')
  }
}

onMounted(() => {
  getMaterialList()
})
</script>

<template>
  <div class="stock-container">
    <div class="stock-container__content">
      <h2 class="mb-12 header">Stock Material</h2>
      <div class="mb-24 flex-end justify-between">
        <div class="mt-4 flex-end gap-12" style="width: 50%">
          <el-input
            v-model="search"
            placeholder="Search Material"
            class="search-input"
            size="large"
          >
          </el-input>
          <el-button
            :icon="Search"
            @click="searchMaterial"
            class="pt-16 pb-16 pl-15 pr-15"
            type="primary"
            style="height: 40px"
          />
        </div>
        <el-button type="primary" class="pt-16 pb-16 pl-15 pr-15" style="height: 38px">
          <el-icon class="mr-8"><Plus /></el-icon>
          Add
        </el-button>
      </div>
      <el-table
        :data="tableData"
        class="main-table"
        row-class-name="extend-row"
        v-loading="tableLoading"
        max-height="80vh"
        :empty-text="' '"
        :style="{ height: tableLoading || tableData.length === 0 ? '350px' : '' }"
        header-row-class-name="background-header"
      >
        <template #empty v-if="!tableLoading">
          <div style="height: 70vh" class="flex-align-center justify-center">No Data</div></template
        >
        <el-table-column
          prop="Material"
          label="Material"
          align="center"
          min-width="160"
          fixed="left"
        >
          <template #default="scoped">
            <p class="font-bold text-sm">{{ scoped.row.Material }}</p>
          </template>
        </el-table-column>
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
              size="large"
              v-model="scoped.row[location]"
              :id="`input-${scoped.$index}-${location}`"
              @keydown="handleTab($event, scoped.$index, location)"
              @input="handleInput(scoped.row, location)"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="summary"
          label="Summary"
          min-width="160"
          align="center"
          fixed="right"
        >
          <template #default="scoped">
            <el-input :value="sum(scoped.row)" readonly class="is-success" size="large" />
          </template>
        </el-table-column>
      </el-table>
      <div class="save-container mt-24 mb-24">
        <h3 class="pl-20">Save Material</h3>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
@import '@/assets/variable.scss';

.search-input {
  .el-input__wrapper {
    .el-input__inner {
      font-weight: 600;
      font-size: 16px !important;
    }
  }
}

.is-success {
  .el-input__wrapper {
    .el-input__inner {
      font-weight: 600;
      font-size: 16px;
    }
  }
}

.stock-container {
  display: flex;
  justify-content: center;
  height: 100vh;
  overflow-y: scroll;
  margin-bottom: 52px;
  margin-top: 52px;

  .stock-container__content {
    max-width: 90%;

    .header {
      background-color: $primary-color;
      padding-bottom: 4px;
      color: #ffffff;
      padding: 20px;
      box-shadow:
        0 4px 6px -1px #0000001a,
        0 2px 4px -2px #0000001a;
    }

    .extend-row {
      td {
        padding-top: 20px !important;
        padding-bottom: 20px !important;
      }
    }

    .main-table {
      border: 1px solid $primary-color;
      width: 100%;
    }

    .save-container {
      background: #ffffff;
      width: 100%;
      height: 300px;
      border-radius: 8px;
      border: 1px solid $primary-color;
    }
  }
}
</style>
