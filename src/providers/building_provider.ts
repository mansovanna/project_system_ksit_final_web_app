import api from './api'

class BuildProvider {
  getBuiildAll(search: string, per_page: number = 10, page: number = 1) {
    return api.get('/admin/build', {
      params: {
        search: search,
        per_page: per_page,
        page: page,
      },
    })
  }

  addBuild(name: string, gender: string, floor: number, room: number) {
    return api.post('/admin/build', { name: name, gender: gender, floor: floor, room: room })
  }
  // ---------------------------------------------------------
  updateBuild(id: string, name: string, gender: string) {
    return api.post(`/admin/build/update/${id}`, {
      name,
      gender,
    })
  }

  // Block delete
  deleteBuild(id: number) {
    return api.delete(`/admin/build/${id}`)
  }
}

export default new BuildProvider()
