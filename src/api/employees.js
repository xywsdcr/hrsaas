import request from '@/utils/request'

//获取员工简单列表
export function getEmployeeSimple () {
  return request({
    url: '/sys/user/simple'
  })
}

//获取员工综合列表
export function getEmployeeList (params) {
  return request({
    url: '/sys/user',
    params
  })
}

//删除员工
export function delEmployee (id) {
  return request({
    url: `/sys/user/${id}`,
    method: 'DELETE',
  })
}

//新增员工
export function addEmployee (data) {
  return request({
    url: '/sys/user',
    method: 'POST',
    data
  })
}

//批量导入员工 data数组类型
export function importEmployee (data) {
  return request({
    url: '/sys/user/batch',
    method: 'POST',
    data
  })
}

//保存用户基本信息
export function saveUserDetailsById (data) {
  return request({
    url: `/sys/user/${data.id}`,
    method: 'PUT',
    data
  })
}

//获取员工详情基础信息
export function getPersonalDetails (id) {
  return request({
    url: `/employees/${id}/personalInfo`
  })
}

//更新员工详情基础信息
export function updatePersonal (data) {
  return request({
    url: `/employees/${data.userId}/personalInfo`,
    method: 'PUT',
    data
  })
}

//获取用户的岗位信息
export function getJobDetail (id) {
  return request({
    url: `/employees/${id}/jobs`
  })
}


//保存岗位信息
export function updateJob (data) {
  return request({
    url: `/employees/${data.userId}/jobs`,
    method: 'PUT',
    data
  })
}
