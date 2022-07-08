import request from '@/utils/request'

/*
 * 班级管理模块
 */

// 保存
export const saveClass = (data) => {
  return request({
    url: '/class',
    method: 'post',
    data: data
  })
}
// 获取班级列表
export const getClass = () => {
  return request({
    url: '/class',
    method: 'get'
  })
}
// 获取班级树
export const getClassTree = () => {
  return request({
    url: '/class/tree',
    method: 'get'
  })
}

// 更新班级
export const updateClass = (data) => {
  return request({
    url: '/class',
    method: 'put',
    data: data
  })
}
// 删除班级
export const deleteClass = (id) => {
  return request({
    url: '/class/' + id,
    method: 'delete'
  })
}
