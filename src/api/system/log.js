import request from '@/utils/request'


const api_name = '/admin/system/sysOperLog';

export default {
  //获取分页列表
  getPageList(page,limit,searchObj){
    return request({
      url:`${api_name}/${page}/${limit}`,
      method: 'get',//提交方式
      params: searchObj  //提交参数
    })
  },
    removeById(id){
    return request({
      // url: +page+"/"+limit,
      url:`${api_name}/remove/${id}`,
      method: 'delete'//提交方式
    })
  },
//   //角色管理列表
//   getPageList(page,limit,searchObj){
//     return request({
//       // url: +page+"/"+limit,
//       url:`${api_name}/${page}/${limit}`,
//       method: 'get',//提交方式
//       params: searchObj  //提交参数
//     })
//   },
//   //删除
//   removeId(id){
//     return request({
//       // url: +page+"/"+limit,
//       url:`${api_name}/remove/${id}`,
//       method: 'delete'//提交方式
//     })
//   },
//   //添加角色
//   saveRole(role){
//     return request({
//       // url: +page+"/"+limit,
//       url:`${api_name}/save`,
//       method: 'post',//提交方式
//       //传递json格式
//       data: role
//     })
//   },
//   //根据id查询
//   getRoleId(id){
//     return request({
//       // url: +page+"/"+limit,
//       url:`${api_name}/findRoleById/${id}`,
//       method: 'get',//提交方式
//     })
//   },
//
//   //修改角色信息
//   update(role){
//     return request({
//       // url: +page+"/"+limit,
//       url:`${api_name}/update`,
//       method: 'put',//提交方式
//       //传递json格式
//       data: role
//     })
//   },
//   //批量删除
  batchRemove(idList) {
    return request({
      url: `${api_name}/batchRemove`,
      method: `delete`,
      data: idList
    })
  },
//   //根据用户id查询用户已分配的角色
//   getRolesByUserId(userId) {
//     return request({
//       url: `${api_name}/toAssign/${userId}`,
//       method: 'get'
//     })
//   },
//
// //分配角色
//   assignRoles(assginRoleVo) {
//     return request({
//       url: `${api_name}/doAssign`,
//       method: 'post',
//       data: assginRoleVo
//     })
//   }

}

