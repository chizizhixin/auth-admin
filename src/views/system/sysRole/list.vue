<template>

  <div class="app-container">
    角色列表
    <!--查询表单-->
    <div class="search-div">
      <el-form label-width="70px" size="small">
        <el-row>
          <el-col :span="24">
            <el-form-item label="角色名称">
              <el-input style="width: 100%" v-model="searchObj.roleName" placeholder="角色名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="display:flex">
          <el-button type="primary" icon="el-icon-search" size="mini"  @click="fetchData()">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetData">重置</el-button>
        </el-row>
      </el-form>
    </div>
    <div class="tools-div">
      <el-button type="success" icon="el-icon-plus" size="mini" @click="add">添 加</el-button>
      <el-button class="btn-add" size="mini" @click="batchRemove()" >批量删除</el-button>
    </div>
<!--    <el-table-->
<!--      v-loading="listLoading"-->
<!--      :data="list"-->
<!--      stripe-->
<!--      border-->
<!--      style="width: 100%;margin-top: 10px;"-->
<!--      @selection-change="handleSelectionChange">-->
<!--      <el-table-column type="selection"/>-->
      <!-- 表格 -->
      <el-table
        v-loading="listLoading"
        :data="list"
        stripe
        border
        style="width: 100%;margin-top: 10px;"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection"/>
        <el-table-column
          label="序号"
          width="70"
          align="center">
          <template slot-scope="scope">
            {{ (page - 1) * limit + scope.$index + 1 }}
          </template>
        </el-table-column>

        <el-table-column prop="roleName" label="角色名称" />
        <el-table-column prop="roleCode" label="角色编码" />
        <el-table-column prop="createTime" label="创建时间" width="160"/>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit(scope.row.id)" title="修改"/>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeDataById(scope.row.id)" title="删除"/>
            <el-button type="warning" icon="el-icon-baseball" size="mini" @click="showAssignAuth(scope.row)" title="分配权限"/>
          </template>
        </el-table-column>
      </el-table>

    <!-- 分页组件 -->
    <el-pagination
      class="pageList"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    ></el-pagination>
    <!-- 添加弹框 -->
    <el-dialog title="添加/修改" :visible.sync="dialogVisible" width="40%" >
      <el-form ref="dataForm" :model="sysRole" label-width="150px" size="small" style="padding-right: 40px;">
        <el-form-item label="角色名称">
          <el-input v-model="sysRole.roleName"/>
        </el-form-item>
        <el-form-item label="角色编码">
          <el-input v-model="sysRole.roleCode"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small" icon="el-icon-refresh-right">取 消</el-button>
        <el-button type="primary" icon="el-icon-check" @click="saveOrUpdate()" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
//引入定义接口的js文件
import api from '@/api/system/role'
export default {
   //定义初始值
  data(){
    return{
      listLoading:true, //显示是否显示加载的图标
      list:[], //角色列表数组
      total:0,//总记录数
      page:1,//当前页数
      limit:10,//每页显示记录数
      searchObj:{},//条件查询封装对象

      dialogVisible: false, //弹出框
      sysRole: {}, //封装添加表单数据
      selectValue:[], //复选框选择的内容封装的数组

    }
  },
  //页面渲染之前执行
  created() {
    //调用列表方法
    this.fetchData()
  },
  //具体方法
  methods:{
    handleSizeChange (val) {
      this.limit = val
      this.fetchData();
    },
    handleCurrentChange (val) {
      this.page = val
      this.fetchData();
    },
    //重置
    resetData(){
      //清空表单
      this.searchObj = {}
      //查询所有数据
      this.fetchData()
    },
    //条件分页查询列表方法
    //pageNum 查询页数
    fetchData(){
      api.getPageList(this.page,this.limit,this.searchObj)
         .then(response => {
           this.listLoading = false
           // console.log(response)
           this.list = response.data.records
           this.total = response.data.total
         })
    },
    //删除角色
    removeDataById(id) {
      // debugger
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => { // promise
        // 点击确定，远程调用ajax
        return api.removeId(id)
      }).then((response) => {
        this.fetchData(this.page)
        this.$message.success(response.message || '删除成功')
      })
    },
    //点击添加，弹出框
    add(){
      this.dialogVisible = true
      this.sysRole = {}
    },
    saveOrUpdate(){
      // 判断是添加还是修改
      if (!this.sysRole.id){
        this.save()
      }else {
        this.updateRole()
      }

    },
    save() {
      api.saveRole(this.sysRole).then(response => {
        this.$message.success(response.message || '添加成功')
        this.dialogVisible = false
        this.fetchData(this.page)
      })
    },
    updateRole(){
     api.update(this.sysRole)
        .then(response => {
          this.$message.success(response.message || '修改成功')
          this.dialogVisible = false
          this.fetchData(this.page)
        })
    },

    //修改进行数据回显
    edit(id){
      this.dialogVisible = true
      api.getRoleId(id).then(response=>{
        this.sysRole  = response.data
      })
    },
    //复选框发生变化，执行方法
    handleSelectionChange(selection){
       this.selectValue = selection
      // console.log(this.selectValue)
    },
    //批量删除
    batchRemove(){
      if (this.selectValue.length == 0){
        this.$message.warning( '请选择要删除记录')
        return
      }else {
        this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var idList = []
          for (var i = 0;i<this.selectValue.length;i++){
            var obj = this.selectValue[i]
            var id = obj.id
            idList.push(id)
          }
          api.batchRemove(idList).then(response=>{
            this.fetchData(this.page)
            this.$message.success(response.message || '删除成功')
          })
        })
      }
    },
    showAssignAuth(row) {
      this.$router.push('/system/assignAuth?id='+row.id+'&roleName='+row.roleName);
    }
  }
}
</script>
<style>
.search-div {
  padding:10px;border: 1px solid #EBEEF5;border-radius:3px;
}
.tools-div {
  margin-top: 10px;padding:10px;border: 1px solid #EBEEF5;border-radius:3px;
}
</style>
