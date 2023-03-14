import request from '@/utils/request'

// 查询上传文件列表
export function listUploadFiles(query) {
  return request({
    url: '/system/uploadFiles/list',
    method: 'get',
    params: query
  })
}

// 查询上传文件详细
export function getUploadFiles(id) {
  return request({
    url: '/system/uploadFiles/' + id,
    method: 'get'
  })
}

// 新增上传文件
export function addUploadFiles(data) {
  return request({
    url: '/system/uploadFiles',
    method: 'post',
    data: data
  })
}

// 修改上传文件
export function updateUploadFiles(data) {
  return request({
    url: '/system/uploadFiles',
    method: 'put',
    data: data
  })
}

// 删除上传文件
export function delUploadFiles(id) {
  return request({
    url: '/system/uploadFiles/' + id,
    method: 'delete'
  })
}
