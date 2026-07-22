import api from './api'

class ReportStudentProvider {
  getStudents(
    search: string,
    start_date: string,
    end_date: string,
    status: string,
    per_page: number,
    page: number,
  ) {
    return api.get('/admin/reports/stdeutns', {
      params: {
        search: search,
        start_date: start_date,
        end_date: end_date,
        status: status,
        per_page: per_page,
        page: page,
      },
    })
  }

  // downloadCSV ()
  getLeaves(
    search: string,
    start_date: string,
    end_date: string,
    status: string,
    per_page: number,
    page: number,
  ) {
    return api.get('/admin/reports/leave', {
      params: {
        search: search,
        start_date: start_date,
        end_date: end_date,
        status: status,
        per_page: per_page,
        page: page,
      },
    })
  }
  getPayments(sarch: string, start_date: string, end_date: string) {
    return api.get('/admin/reports/payment', {
      params: {
        sarch: sarch,
        start_date: start_date,
        end_date: end_date,
      },
    })
  }
}

export default new ReportStudentProvider()
