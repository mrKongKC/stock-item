import { defineStore } from 'pinia'

export const useMaterialStore = defineStore('material', {
  state: () => ({
    material: [],
    finalMaterial: []
  }),
  actions: {
    setMaterial(material) {
      this.material = material
    },
    setFinalMaterial(material) {
      this.finalMaterial = material
    },
    updateMaterial(row, location, value) {
      const materialIndex = this.material.findIndex((item) => item.Material === row.Material)
      if (materialIndex !== -1) {
        this.material[materialIndex][location] = value
      }
    }
  },
  getters: {
    getMaterial: (state) => state.material
  }
})
