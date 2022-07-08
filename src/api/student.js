import request from '@/utils/request'

// 新增学生
export function addStudent(data) {
  return request({
    url: '/student',
    method: 'post',
    data: data
  })
}

// 获取学生列表
export function getStudentList(parms) {
  return request({
    url: '/student',
    method: 'get',
    params: parms
  })
}

// 编辑学生
export function editStudent(data) {
  return request({
    url: '/student',
    method: 'put',
    data: data
  })
}

// 删除学生
export function deleteStudent(id) {
  return request({
    url: '/student/' + id,
    method: 'delete'
  })
}

// 获取学生个人信息
// export function getStudentInfo() {
//   return request({
//     url: '/student/info',
//     method: 'get'
//   })
// }
