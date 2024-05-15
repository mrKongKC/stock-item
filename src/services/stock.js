// Assume as a API file
import mockData from '../config/data.json'
export default {
  getMaterialList() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockData.materials)
      }, 800)
    })
  }
}
