<script setup>
import { onMounted, ref } from 'vue'
import stockApi from '../services/stock.js'
import { Loading, Search, Plus, Checked } from '@element-plus/icons-vue'
import { useMaterialStore } from '@/stores/material'
import { ElNotification } from 'element-plus'
const materialStore = useMaterialStore()

const search = ref('')
const searchAll = ref('')
const tableLoading = ref(false)
const loadingNewSave = ref(false)
const loadingSearch = ref(false)
const dialogFormVisible = ref(false)
const tableData = ref([])
const resultSearchAllMaterial = ref([])
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

const addNew = () => {
  new Promise((resolve) => {
    const latestMaterial = materialStore.defaultMaterial.length
    resultSearchAllMaterial.value.forEach((material) => {
      const exists = materialStore.defaultMaterial.some(
        (existingMaterial) =>
          existingMaterial.Material === material.Material &&
          existingMaterial.Location === material.Location
      )
      if (!exists) {
        materialStore.addMaterial(material)
      }
    })
    resolve(latestMaterial)
  }).then((latestMaterial) => {
    if (latestMaterial === materialStore.defaultMaterial.length) {
      ElNotification({
        title: 'Warning',
        message: 'Materials already exist',
        type: 'warning',
        duration: 2000
      })
    } else {
      ElNotification({
        title: 'Success',
        message: 'Successfully added materials',
        type: 'success',
        duration: 2000
      })
      dialogFormVisible.value = false
      getMaterialList()
    }
  })
}

const searchMaterial = () => {
  const query = search.value.toLowerCase()
  tableData.value = materialStore.getMaterial.filter((item) =>
    item.Material.toLowerCase().includes(query)
  )
}

const searchAllMaterial = () => {
  loadingSearch.value = true
  setTimeout(() => {
    const query = searchAll.value.toLowerCase()
    resultSearchAllMaterial.value = materialStore.getAllMaterials.filter(
      (item) => item.Material.toLowerCase() === query
    )
    loadingSearch.value = false
  }, 800)
}

const saveMaterial = () => {
  loadingNewSave.value = true
  const result = materialStore.getMaterial.flatMap((material) => {
    const { Material, ...location } = material
    return Object.entries(location).map(([Location, QTY]) => ({
      Material,
      Location,
      QTY
    }))
  })
  saveFinalMaterial.value = result
  const unProxyArray = saveFinalMaterial.value.map((proxyObj) => ({ ...proxyObj }))
  console.log(unProxyArray) //submit finale value
  setTimeout(() => {
    loadingNewSave.value = false
  }, 1000)
}

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
  <el-dialog v-model="dialogFormVisible" title="Add Material" width="450">
    <div class="dialog-content-in-stock">
      <div class="flex gap-12 flex-align-center">
        <el-input
          v-model="searchAll"
          placeholder="Search Material"
          class="search-input"
          size="large"
        >
        </el-input>
        <el-button
          :icon="Search"
          @click="searchAllMaterial"
          class="pt-16 pb-16 pl-15 pr-15"
          type="primary"
          style="height: 42px"
        />
      </div>
      <div
        class="pre-container mt-12 flex justify-center"
        :class="{ 'flex-align-center': loadingSearch }"
      >
        <el-icon class="rotate-animation primary-color" style="font-size: 32px" v-if="loadingSearch"
          ><Loading
        /></el-icon>
        <pre
          class="text-md font-bold"
          v-else-if="resultSearchAllMaterial.length > 0 && !loadingSearch"
        >
              {{ resultSearchAllMaterial }}
      </pre
        >
        <p
          class="flex-align-center text-md"
          v-else-if="resultSearchAllMaterial.length === 0 && !loadingSearch"
        >
          No data
        </p>
      </div>
      <div class="mt-12 flex">
        <el-button
          type="primary"
          class="pt-16 pb-16 pl-15 pr-15 w-100"
          style="height: 42px"
          :disabled="resultSearchAllMaterial.length === 0"
          @click="addNew"
        >
          <el-icon class="mr-8"><Plus /></el-icon>
          Add
        </el-button>
      </div>
    </div>
  </el-dialog>
  <div class="stock-container">
    <div class="stock-container__content">
      <div class="w-100">
        <p class="mb-24 header font-bold text-2xl">Stock Material</p>
        <div class="mb-24 header__search-box">
          <div class="mt-4 flex-end gap-12 input-search">
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
          <el-button
            type="primary"
            class="pt-16 pb-16 pl-15 pr-15"
            style="height: 42px"
            plain
            @click="dialogFormVisible = true"
          >
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
          min-width="120"
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
          min-width="140"
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
          'display-material': saveFinalMaterial.length > 0,
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

.dialog-content-in-stock {
  .pre-container {
    background: #ffffff;
    height: 300px;
    border-radius: 4px;
    border: 1px solid $primary-color;
    overflow-y: auto;
  }
}

.stock-container {
  display: flex;
  justify-content: center;
  overflow: scroll;
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

    @media (max-width: 425px) {
      max-width: 100%;
    }

    .header {
      background-color: $primary-color;
      padding-bottom: 4px;
      color: #ffffff;
      padding: 20px;
      box-shadow:
        0 4px 6px -1px #0000001a,
        0 2px 4px -2px #0000001a;
    }

    .header__search-box {
      display: flex;
      justify-content: space-between;

      @media (max-width: 425px) {
        flex-direction: column;
        padding: 0 4px;
      }

      .input-search {
        width: 50%;

        @media (max-width: 425px) {
          width: 100%;
          margin-bottom: 12px;
        }
      }
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

    .display-material {
      justify-content: space-between;

      @media (max-width: 425px) {
        justify-content: initial;
        align-items: center;
        flex-direction: column;
      }
    }

    .save-container {
      background: #ffffff;
      height: 300px;
      width: 60%;
      border-radius: 4px;
      border: 1px solid $primary-color;
      margin-bottom: 52px;

      @media (max-width: 425px) {
        width: 100%;
      }
    }
  }
}
</style>
