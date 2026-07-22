import api from './api'

class LeaveStudentProvider {
  requestLeave(data: FormData) {
    return api.post('/user/leave', data)
  }

  getLeave(status: string, per_page: number = 10, page: number = 1) {
    return api.get('/user/leave', {
      params: {
        status: status,
        per_page: per_page,
        page: page,
      },
    })
  }
}

export default new LeaveStudentProvider()
