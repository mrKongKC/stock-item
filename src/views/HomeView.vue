
<script setup>
import BaseInput from '@/components/InputComponent.vue'
import { useStore } from '@/stores/store'
import { onMounted, ref } from 'vue'

const materialStore = useStore()
const defaultmaterials = ref(materialStore.material)
const materialsRow = ref(null)
const materialsColumn = ref(null)
const materials = ref([])
const search = ref('')

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
  let match = materials.value.filter((option) => option.Material.includes(search.value))
  if (match.length > 1) {
    const uniqueMaterials = new Set()
    materialsRow.value = match.reduce((uniqueNames, item) => {
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

    const customSortRow = (a, b) => {
      const numA = parseInt(a.slice(3))
      const numB = parseInt(b.slice(3))
      return numA - numB
    }

    materialsColumn.value = materialsColumn.value.sort(customSortColumn)
    materialsRow.value = materialsRow.value.sort(customSortRow)
    materials.value = []
    materialsRow.value.forEach((material, rowIndex) => {
      materialsColumn.value.forEach((location, colIndex) => {
        const index = colIndex * materialsRow.value.length + rowIndex + 1
        const data = match.find((item) => item.Material === material && item.Location === location)

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
}

onMounted(() => {
  filterMaterialsTable()
})
</script>
<template>
  <div class="main-container">
    <div class="nav-search">
      <div class="nav-search__material">
        <BaseInput v-model:inputField="search" label="Material" />
        <button @click="searchMaterial">search</button>
      </div>
      <div class="w-100 right">
        <button @click="testClick">Add Material</button>
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
  </div>
</template>
<style scoped>
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
  padding: 0 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 80px;
}

.nav-search__material {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
}
</style>