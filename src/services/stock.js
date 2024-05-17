// Assume as a API file
import mockData from '../config/data.json'
import allMockData from '../config/materialType.json'
import { useMaterialStore } from '@/stores/material'

export default {
  getMaterialList() {
    const materialStore = useMaterialStore()
    materialStore.setAllMaterial(allMockData.materials)
    return new Promise((resolve) => {
      setTimeout(() => {
        materialStore.setDefaultMaterial(mockData.materials)
        resolve(materialStore.defaultMaterial)
      }, 800)
    })
  }
}
