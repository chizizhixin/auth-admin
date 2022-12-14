import request from '@/utils/request'


const api_name = '/admin/dish/user';

export default {

  //获取分页信息
  getPageList(page, limit, searchObj) {
    return request({
      url: `${api_name}/${page}/${limit}`,
      method: 'get',
      params: searchObj // url查询字符串或表单键值对
    })
  },
  //根据id获取用户信息
  getById(id) {
    return request({
      url: `${api_name}/findById/${id}`,
      method: 'get'
    })
  },
  //根据id获取用户信息
  getAll() {
    return request({
      url: `${api_name}/findAll`,
      method: 'get'
    })
  },
// //保存
//   save(role) {
//     return request({
//       url: `${api_name}/save`,
//       method: 'post',
//       data: role
//     })
//   },
//   //修改
//   updateById(role) {
//     return request({
//       url: `${api_name}/update`,
//       method: 'put',
//       data: role
//     })
//   },
  //根据id删除
  removeById(id) {
    return request({
      url: `${api_name}/remove/${id}`,
      method: 'delete'
    })
  },
  //更改用户状态
  updateStatus(id,status){
    return request({
      url:`${api_name}/updateStatus/${id}/${status}`,
      method:'get'
    })
  },
  //批量删除
  batchRemove(idList) {
    return request({
      url: `${api_name}/batchRemove`,
      method: `delete`,
      data: idList
    })
  },


}
