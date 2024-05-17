import { defineStore } from 'pinia'

export const useMaterialStore = defineStore('material', {
  state: () => ({
    material: [],
    allMaterial: [],
    defaultMaterial: [],
  }),
  actions: {
    addMaterial(material) {
      this.defaultMaterial.push(material)
    },
    setMaterial(material) {
      this.material = material
    },
    setAllMaterial(material) {
      this.allMaterial = material
    },
    setDefaultMaterial(material) {
      this.defaultMaterial = material
    },
    updateMaterial(row, location, value) {
      const materialIndex = this.material.findIndex((item) => item.Material === row.Material)
      if (materialIndex !== -1) {
        this.material[materialIndex][location] = value
      }
    }
  },
  getters: {
    getMaterial: (state) => state.material,
    getAllMaterials: (state) => state.allMaterial
  }
})
