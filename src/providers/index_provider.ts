import api from './api'

class IndexProvider {
  getIndex() {
    return api.get('/admin/dash')
  }
}

export default new IndexProvider()
