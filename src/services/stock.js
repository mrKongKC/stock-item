// Assume as a API file
import mockData from '../config/data.json'
import allMockData from '../config/materialType.json'
import { useMaterialStore } from '@/stores/material'

export default {
  getMaterialList() {
    const materialStore = useMaterialStore()
    return new Promise((resolve) => {
      setTimeout(() => {
        materialStore.setFinalMaterial(mockData.materials)
        resolve(materialStore.finalMaterial)
      }, 800)
    })
  },
  getAllMaterial() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(allMockData.materials)
      }, 800)
    })
  }
}
