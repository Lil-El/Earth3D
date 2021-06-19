import request from '@/utils/request'

export function getAreaList() {
  return request({
    url: '/earth/getAreaList',
    method: 'get'
  })
}
