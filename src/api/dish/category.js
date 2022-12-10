import request from '@/utils/request'


const api_name = '/admin/dish/category';

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
  //添加分类
  save(category){
    return request({
      // url: +page+"/"+limit,
      url:`${api_name}/save`,
      method: 'post',//提交方式
      //传递json格式
      data: category
    })
  },
  //根据id查询
  getCategoryId(id){
    return request({
      // url: +page+"/"+limit,
      url:`${api_name}/getCategory/${id}`,
      method: 'get',//提交方式
    })
  },

  //修改角色信息
  update(role){
    return request({
      // url: +page+"/"+limit,
      url:`${api_name}/update`,
      method: 'put',//提交方式
      //传递json格式
      data: role
    })
  },
  //更改分类状态
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

