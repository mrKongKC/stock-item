
import axios from 'axios'

const apiClient = axios.create({
    baseURL: 'https://my-json-server.typicode.com/mrKongKC/server-testing',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    }
})

export default {
    async getStock() {
        try {
            const res = await apiClient.get('db')
            return res.data
        } catch (err) { console.log(err)}
    },
}