/* eslint-disable @typescript-eslint/no-explicit-any */
// import ApiService from '@/service/api_service'

import api from './api'

// class PolicyProvider extends ApiService {
//   async getPolicy(params: { page?: number; limit?: number; search?: string; status?: string }) {
//     const response = await this.apiClient.get('/policies', { params })
//     return response
//   }
// }

// export default PolicyProvider

class PolicyService {
  getPolicy(params: { page?: number; limit?: number; search?: string; status?: string }) {
    return api.get('/admin/policy', { params })
  }

  getPolicyById(id: string) {
    return api.get(`/admin/policy/${id}`)
  }

  createPolicy(data: any) {
    // console.log('Policy Provider:', data)
    return api.post('/admin/policy', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  }

  updatePolicy(id: number, params: { title: string; description: string }) {
    return api.put(`/admin/policy/${id}`, params)
  }

  updateFile(id: number, data: any) {
    return api.post(
      `/admin/policy/update-file/${id}`,
      { file_path: data },
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        params: {
          _method: 'PUT',
        },
      },
    )
  }

  deletePolicy(id: number) {
    return api.delete(`/admin/policy/${id}`)
  }

  // get policy only
  getPolicyOnly({ search, per_page, page }: { search: string; per_page: number; page: number }) {
    return api.get('/policy-list-only', { params: { search, per_page, page } })
  }
}

export default new PolicyService()
