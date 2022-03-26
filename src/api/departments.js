import request from '@/utils/request'

//获取组织架构
export function getDepartments () {
  return request({
    url: '/company/department'
  })
}

//删除组织部门
export function delDepartments (id) {
  return request({
    url: `/company/department/${id}`,
    method: 'DELETE'
  })
}

//增加组织部门
export function addDepartments (data) {
  return request({
    url: '/company/department',
    method: 'POST',
    data
  })
}

//获取某个部门详情
export function getDepartDetail (id) {
  return request({
    url: `/company/department/${id}`,
  })
}

//保存编辑数据接口
export function updateDepartments (data) {
  return request({
    url: `/company/department/${data.id}`,
    method: 'PUT',
    data
  })
}