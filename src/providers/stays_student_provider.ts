import api from './api'

class StaysStudentProvider {
  getStaysStudentList(page: number, per_page: number) {
    // Implementation for fetching stays student list
    return api.get('/user/stays-students', {
      params: {
        page,
        per_page,
      },
    })
  }

  getStaysByIdStudent(id: number, search: string, page: number, per_page: number) {
    // Implementation for fetching stays by student ID
    return api.get(`/admin/room/stays-students/${id}`, {
      params: {
        search,
        page,
        per_page,
      },
    })
  }
}

export default new StaysStudentProvider()
