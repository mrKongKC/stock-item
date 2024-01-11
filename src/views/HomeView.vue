
<script setup>
import BaseInput from '@/components/InputComponent.vue'
import { useStore } from '@/stores/store'
import { onMounted, reactive, ref, computed } from 'vue'

const materialStore = useStore()
const defaultmaterials = ref(materialStore.material)
const materialsRow = ref(null)
const materialsColumn = ref(null)
const showPopup = ref(false)
const showSearch = ref(false)
const showAll = ref(false)
const materials = ref([])
const searchMaterials = ref([])
const sortMaterials = ref([])
const search = ref('')
const form = reactive({
  location: '',
  material: '',
  productCode: '',
  qty: 0
})

const ableToClick = computed(() => {
  const locationLength = form.location.length === 2
  const materialLength = form.material.length === 7
  return (
    !!form.location &&
    locationLength &&
    !!form.material &&
    materialLength &&
    !!form.description &&
    !!form.qty
  )
})

const ableToSearch = computed(() => search.value.length > 0)

const filterMaterialsTable = () => {
  const uniqueMaterials = new Set()

  materialsRow.value = defaultmaterials.value.reduce((uniqueNames, item) => {
    if (!uniqueMaterials.has(item.Material)) {
      uniqueMaterials.add(item.Material)
      uniqueNames.push(item.Material)
    }
    return uniqueNames
  }, [])

  materialsColumn.value = defaultmaterials.value.reduce((uniqueNames, item) => {
    if (!uniqueMaterials.has(item.Location)) {
      uniqueMaterials.add(item.Location)
      uniqueNames.push(item.Location)
    }
    return uniqueNames
  }, [])

  const customSortColumn = (a, b) => {
    const numA = parseInt(a.slice(1))
    const numB = parseInt(b.slice(1))
    return numA - numB
  }

  const customSortRpw = (a, b) => {
    const numA = parseInt(a.slice(3))
    const numB = parseInt(b.slice(3))
    return numA - numB
  }

  materialsColumn.value = materialsColumn.value.sort(customSortColumn)
  materialsRow.value = materialsRow.value.sort(customSortRpw)
  materials.value = []
  materialsRow.value.forEach((material, rowIndex) => {
    materialsColumn.value.forEach((location, colIndex) => {
      const index = colIndex * materialsRow.value.length + rowIndex + 1
      const data = defaultmaterials.value.find(
        (item) => item.Material === material && item.Location === location
      )

      const obj = {
        ID: index,
        Material: material,
        ProductCode: data?.ProductCode ? data?.ProductCode : '',
        Location: location,
        QTY: data?.QTY ? data?.QTY : 0
      }

      materials.value.push(obj)
    })
  })
}

const findMaterialData = (material, location) => {
  const data = materials.value.find(
    (item) => item.Material === material && item.Location === location
  )

  return data ? data : ''
}

const sum = (material) => {
  const data = materials.value.filter((item) => item.Material === material)
  let total = 0

  data.forEach((item) => {
    const { QTY } = item
    const number = QTY ? parseInt(QTY, 10) : 0
    total += number
  })

  return total
}

const searchMaterial = () => {
  filterMaterialsTable()
  searchMaterials.value = materials.value.filter((option) => option.Material.includes(search.value))
  if (searchMaterials.value.length > 0) {
    showSearch.value = true
  }
}

const closePopup = () => {
  form.location = ''
  form.material = ''
  form.productCode = ''
  form.qty = 0
  showPopup.value = false
}

const closeSearchPopup = () => {
  filterMaterialsTable()
  showSearch.value = false
  search.value = ''
}

const addNewMaterial = () => {
  if (ableToClick.value) {
    const tempForm = {
      ID: 1,
      Material: form.material,
      ProductCode: form.productCode,
      Location: form.location,
      QTY: parseInt(form.qty, 10)
    }
    materialStore.setMaterial(tempForm)
    closePopup()
    filterMaterialsTable()
  }
}

const saveMaterials = () => {
  filterMaterialsTable()
   sortMaterials.value = materials.value.sort((a, b) => a.ID - b.ID);
  console.log(sortMaterials.value);
  showAll.value = true
}

onMounted(() => {
  filterMaterialsTable()
})
</script>
<template>
  <div class="main-container">
    <div class="nav-search">
      <div class="nav-search__material">
        <BaseInput v-model:inputField="search" label="Material" placeholder="MAT00xx" />
        <button
          @click="searchMaterial"
          class="btn btn-secondary"
          :class="{ 'btn-disable': !ableToSearch }"
          :disabled="!ableToSearch"
        >
          Search
        </button>
      </div>
      <div class="w-100 right">
        <button @click="showPopup = true" class="btn btn-primary" style="width: 150px">
          + Add Material
        </button>
      </div>
    </div>
    <div class="table-container">
      <table>
        <tr>
          <th class="font-bold text-md">Material</th>
          <th class="font-bold text-md" v-for="column in materialsColumn" :key="column">
            {{ column }}
          </th>
          <th class="font-bold text-md">SUM</th>
        </tr>
        <tr v-for="row in materialsRow" :key="row">
          <td>{{ row }}</td>
          <td v-for="column in materialsColumn" :key="column">
            <BaseInput v-model:inputField="findMaterialData(row, column).QTY" type="number" />
          </td>
          <td>{{ sum(row) }}</td>
        </tr>
      </table>
    </div>
    <div class="footer">
      <button @click="saveMaterials" class="btn btn-primary" style="width: 150px">Save</button>
    </div>
  </div>
  <div v-show="showAll">
    <div class="overlay"></div>
    <div class="show-all">
      <div class="show-all__header">
        <p class="text-lg font-bold">Materials</p>
        <span class="pointer cross" @click="showAll = !showAll">&#10060;</span>
      </div>
      <div class="show-all__content">
        <div v-for="material in sortMaterials" :key="material" class="show-all__content__card">
          <div class="show-all__content__card__detail">
            <p>
              <span>Material ID: </span><span class="font-bold">{{ material.ID }} </span>
            </p>
            <p>
              <span>Material: </span><span class="font-bold">{{ material.Material }} </span>
            </p>
            <p>
              <span>Product Code: </span>
              <span class="font-bold"
                >{{ material.ProductCode ? material.ProductCode : 'No Product Code' }}
              </span>
            </p>
            <p>
              <span>Location: </span><span class="font-bold">{{ material.Location }} </span>
            </p>
            <p>
              <span>QTY: </span><span class="font-bold">{{ material.QTY }} </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-show="showSearch">
    <div class="overlay"></div>
    <div class="search-material">
      <div class="search-material__header">
        <p class="text-lg font-bold">Search Material</p>
        <span class="pointer cross" @click="closeSearchPopup">&#10060;</span>
      </div>
      <div class="search-material__content">
        <div
          v-for="material in searchMaterials"
          :key="material"
          class="search-material__content__card"
        >
          <div class="search-material__content__card__detail">
            <p>
              <span>Material ID: </span><span class="font-bold">{{ material.ID }} </span>
            </p>
            <p>
              <span>Material: </span><span class="font-bold">{{ material.Material }} </span>
            </p>
            <p>
              <span>Product Code: </span>
              <span class="font-bold"
                >{{ material.ProductCode ? material.ProductCode : 'No Product Code' }}
              </span>
            </p>
            <p>
              <span>Location: </span><span class="font-bold">{{ material.Location }} </span>
            </p>
            <p>
              <span>QTY: </span><span class="font-bold">{{ material.QTY }} </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-show="showPopup">
    <div class="overlay"></div>
    <div class="add-material">
      <div class="add-material__header">
        <p class="text-lg font-bold">Add material</p>
        <span class="pointer cross" @click="closePopup">&#10060;</span>
      </div>
      <div class="add-material__content">
        <BaseInput
          v-model:inputField="form.material"
          label="Material"
          :max="7"
          placeholder="MAT00xx"
          info="The material must long 7 character*"
        />
        <BaseInput
          v-model:inputField="form.location"
          label="Location"
          :max="2"
          placeholder="Ax"
          info="The material must long 2 character*"
        />
        <BaseInput v-model:inputField="form.qty" label="QTY" type="number" />
        <BaseInput v-model:inputField="form.description" label="ProductCode" />
        <button
          @click="addNewMaterial"
          class="btn btn-primary w-100 mt-3"
          :class="{ 'btn-disable': !ableToClick }"
          :disabled="!ableToClick"
        >
          Add
        </button>
      </div>
    </div>
  </div>
</template>
<style scoped>
.cross {
  padding: 0 4px;
  background: #ffabab;
  border-radius: 20%;
}
.cross:hover {
  opacity: 0.6;
}
.add-material,
.search-material,
.show-all {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #ffffff;
  z-index: 99;
  padding: 18px 40px;
  width: 750px;
  border-radius: 8px;
}

.search-material,
.show-all {
  width: 80vw;
}

.add-material__header,
.search-material__header, .show-all__header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.add-material__content {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 24px;
}
.search-material__content,
.show-all__content {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  max-height: 50vh;
  overflow-y: auto;
}

.search-material__content__card__detail,
.show-all__content__card__detail {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.search-material__content__card,
.show-all__content__card {
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #82818140;
}

.footer {
  margin-top: 20px;
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: end;
}
.table-container {
  overflow: auto;
  max-height: 60vh;
  margin-top: 20px;
}

table {
  border-collapse: collapse;
  width: 100%;
  table-layout: auto;
}

th,
td {
  border: 1px solid #82818140;
  text-align: center;
  padding: 8px;
  width: 15%;
}

th {
  background: #ffffff;
  border: 1px solid #82818140;
  position: sticky;
  top: -1px;
  z-index: 1;
  padding: 8px;
  height: 80px;
}
.nav-search {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 80px;
}

.nav-search__material {
  display: flex;
  align-items: flex-end;
  gap: 10px;
  width: 100%;
}
</style>