import { defineStore } from 'pinia'

export const useStore = defineStore('useStore', {
  state: () => {
    return {
      material: [
          {
            "ID": 1,
            "Material": "MAT0001",
            "ProductCode": "PC000001",
            "Location": "A1",
            "QTY": 100
          },
          {
            "ID": 2,
            "Material": "MAT0001",
            "ProductCode": "PC000001",
            "Location": "A2",
            "QTY": 100
          },
          {
            "ID": 3,
            "Material": "MAT0001",
            "ProductCode": "PC000001",
            "Location": "A4",
            "QTY": 100
          },
          {
            "ID": 4,
            "Material": "MAT0002",
            "ProductCode": "PC000002",
            "Location": "A1",
            "QTY": 100
          },
          {
            "ID": 5,
            "Material": "MAT0002",
            "ProductCode": "PC000002",
            "Location": "A3",
            "QTY": 100
          },
          {
            "ID": 6,
            "Material": "MAT0003",
            "ProductCode": "PC000003",
            "Location": "A1",
            "QTY": 100
          },
          {
            "ID": 7,
            "Material": "MAT0004",
            "ProductCode": "PC000004",
            "Location": "A2",
            "QTY": 100
          }
        ]
    }
  },
  actions: {
    setMaterial(material) {
      this.material = material
    },
  }
})