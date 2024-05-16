<script setup>
import { onMounted, ref } from 'vue'
import stockApi from '../services/stock.js'
import { Loading, Search, Plus, Checked } from '@element-plus/icons-vue'
import { useMaterialStore } from '@/stores/material'
const materialStore = useMaterialStore()

const search = ref('')
const tableLoading = ref(false)
const loadingNewSave = ref(true)
const tableData = ref([])
const saveFinalMaterial = ref([])
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

const searchMaterial = () => {
  const query = search.value.toLowerCase()
  tableData.value = materialStore.getMaterial.filter((item) =>
    item.Material.toLowerCase().includes(query)
  )
}

const saveMaterial = () => {
  // const query = search.value.toLowerCase()
  // tableData.value = tableData.value.filter((item) => item.Material.toLowerCase().includes(query))
}

const getMaterialList = () => {
  tableLoading.value = true
  stockApi
    .getMaterialList()
    .then((res) => {
      const response = res
      materialStore.setFinalMaterial(response)
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
      materialStore.setMaterial(tableData.value)
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
  return total.toLocaleString()
}

const handleInput = (row, location) => {
  const nonDigitRegex = /[^0-9]/
  const removeLeadingZeros = /^0+[1-9]/

  if (!row[location]) {
    row[location] = 0
  } else if (removeLeadingZeros.test(row[location])) {
    row[location] = row[location].toString().replace(/^0+/, '')
  } else if (nonDigitRegex.test(row[location])) {
    row[location] = row[location].toString().replace(/[^0-9]/g, '')
  }
  row[location] = Number(row[location]) || 0
  materialStore.updateMaterial(row, location, row[location])
  searchMaterial()
}

onMounted(() => {
  getMaterialList()
})
</script>

<template>
  <div class="stock-container">
    <div class="stock-container__content">
      <div class="w-100">
        <h2 class="mb-24 header">Stock Material</h2>
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
              style="height: 42px"
            />
          </div>
          <el-button type="primary" class="pt-16 pb-16 pl-15 pr-15" style="height: 42px" plain>
            <el-icon class="mr-8"><Plus /></el-icon>
            Add
          </el-button>
        </div>
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
              :formatter="(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
              :parser="(value) => value.replace(/\$\s?|(,*)/g, '')"
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
      <div
        class="flex mt-24"
        :class="{
          'justify-between': saveFinalMaterial.length > 0,
          'justify-end': saveFinalMaterial.length === 0
        }"
      >
        <div class="save-container overflow" v-if="saveFinalMaterial.length > 0">
          <p class="font-bold text-md p-20 sticky header-output" style="top: 0px">
            Save Materials
            <el-icon class="rotate-animation" v-if="loadingNewSave"><Loading /></el-icon>
          </p>
          <div class="flex justify-center" :class="{ 'low-opacity': loadingNewSave }">
            <pre class="text-md font-bold pb-20 pl-20 pr-20 pt-0">
              {{ saveFinalMaterial }}
            </pre>
          </div>
        </div>
        <el-button
          type="primary"
          class="pt-16 pb-16 pl-15 pr-15"
          style="height: 42px; width: 120px"
          @click="saveMaterial"
        >
          <el-icon class="mr-8"><Checked /></el-icon>
          Save
        </el-button>
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
  overflow: hidden;
  height: 100%;

  .low-opacity {
    opacity: 0.1;
  }

  .header-output {
    background-color: $primary-color;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #ffffff;
    z-index: 10;
  }

  .stock-container__content {
    max-width: 90%;
    width: 100%;

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
      height: 300px;
      width: 60%;
      border-radius: 4px;
      border: 1px solid $primary-color;
      margin-bottom: 52px;
    }
  }
}
</style>
