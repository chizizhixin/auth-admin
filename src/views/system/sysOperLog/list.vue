<template>
  <div class="app-container">
    日志列表
    <div class="search-div">
      <el-form label-width="70px" size="small">
        <el-row>
          <el-col :span="8">
            <el-form-item label="关 键 字">
              <el-input style="width: 95%" v-model="searchObj.keyword" placeholder="操作人"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="操作时间">
              <el-date-picker
                v-model="createTimes"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                value-format="yyyy-MM-dd HH:mm:ss"
                style="margin-right: 10px;width: 100%;"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="display:flex">
          <el-button type="primary" icon="el-icon-search" size="mini"  @click="fetchData()">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetData">重置</el-button>
        </el-row>
      </el-form>
    </div>

    <!-- 工具条 -->
    <div class="tools-div">
      <el-button class="btn-add" size="mini" @click="batchRemove()" >批量删除</el-button>
    </div>

    <!-- 列表 -->
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

      <el-table-column prop="operName" label="操作人" width="100"/>
      <el-table-column prop="method" label="操作" width="180"/>
      <el-table-column prop="title" label="类别" />
<!--      <el-table-column label="状态" width="80">-->
<!--        <template slot-scope="scope">-->
<!--          <el-switch-->
<!--            v-model="scope.row.status === 1"-->
<!--            @change="switchStatus(scope.row)">-->
<!--          </el-switch>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column prop="createTime" label="登录时间" />

      <el-table-column label="操作"  align="center" fixed="right">
        <template slot-scope="scope">
          <!--          <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit(scope.row.id)" title="修改"/>-->
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeDataById(scope.row.id)" title="删除" />
          <!--          <el-button type="warning" icon="el-icon-baseball" size="mini" @click="showAssignRole(scope.row)" title="分配角色"/>-->
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

    <!--    <el-dialog title="添加/修改" :visible.sync="dialogVisible" width="40%" >-->
    <!--      <el-form ref="dataForm" :model="sysUser"  label-width="100px" size="small" style="padding-right: 40px;">-->
    <!--        <el-form-item label="用户名" prop="username">-->
    <!--          <el-input v-model="sysUser.username"/>-->
    <!--        </el-form-item>-->
    <!--        <el-form-item v-if="!sysUser.id" label="密码" prop="password">-->
    <!--          <el-input v-model="sysUser.password" type="password"/>-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="姓名" prop="name">-->
    <!--          <el-input v-model="sysUser.name"/>-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="手机" prop="phone">-->
    <!--          <el-input v-model="sysUser.phone"/>-->
    <!--        </el-form-item>-->
    <!--      </el-form>-->
    <!--      <span slot="footer" class="dialog-footer">-->
    <!--        <el-button @click="dialogVisible = false" size="small" icon="el-icon-refresh-right">取 消</el-button>-->
    <!--        <el-button type="primary" icon="el-icon-check" @click="saveOrUpdate()" size="small">确 定</el-button>-->
    <!--      </span>-->
    <!--    </el-dialog>-->
    <!--    <el-dialog title="分配角色" :visible.sync="dialogRoleVisible">-->
    <!--      <el-form label-width="80px">-->
    <!--        <el-form-item label="用户名">-->
    <!--          <el-input disabled :value="sysUser.username"></el-input>-->
    <!--        </el-form-item>-->

    <!--        <el-form-item label="角色列表">-->
    <!--          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>-->
    <!--          <div style="margin: 15px 0;"></div>-->
    <!--          <el-checkbox-group v-model="userRoleIds" @change="handleCheckedChange">-->
    <!--            <el-checkbox v-for="role in allRoles" :key="role.id" :label="role.id">{{role.roleName}}</el-checkbox>-->
    <!--          </el-checkbox-group>-->
    <!--        </el-form-item>-->
    <!--      </el-form>-->
    <!--      <div slot="footer">-->
    <!--        <el-button type="primary" @click="assignRole" size="small">保存</el-button>-->
    <!--        <el-button @click="dialogRoleVisible = false" size="small">取消</el-button>-->
    <!--      </div>-->
    <!--    </el-dialog>-->
  </div>
</template>
<script>
import logApi from '@/api/system/log'
import api from "@/api/system/user";
import loginApi from "@/api/system/loginlog";
export default {
  data(){
    return{
      listLoading: false, // 数据是否正在加载
      list: null, // banner列表
      total: 0, // 数据库中的总记录数
      page: 1, // 默认页码
      limit: 10, // 每页记录数
      searchObj: {}, // 查询表单对象
      selectValue:'',
      createTimes: [],

      dialogVisible: false,
      // sysUser: defaultForm,

      dialogRoleVisible: false,
      allRoles: [], // 所有角色列表
      userRoleIds: [], // 用户的角色ID的列表
      isIndeterminate: false, // 是否是不确定的
      checkAll: false // 是否全选
    }
  },
  created() {
    this.fetchData()
  },
  methods:{
    handleSelectionChange(selection){
      this.selectValue = selection
      // console.log(this.selectValue)
    },
    handleSizeChange (val) {
      this.limit = val
      this.fetchData();
    },
    handleCurrentChange (val) {
      this.page = val
      this.fetchData();
    },
    //列表方法
    fetchData() {
      debugger
      if(this.createTimes && this.createTimes.length === 2) {
        this.searchObj.createTimeBegin = this.createTimes[0]
        this.searchObj.createTimeEnd = this.createTimes[1]
      }
      logApi.getPageList(this.page, this.limit, this.searchObj).then(
        response => {
          console.log(response.data)
          this.list = response.data.records
          this.total = response.data.total
          // 数据加载并绑定成功
          this.listLoading = false
        }
      )
    },
    // 重置查询表单
    resetData() {
      console.log('重置查询表单')
      this.searchObj = {}
      this.createTimes = []
      this.fetchData()
    },
    removeDataById(id){
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => { // promise
        // 点击确定，远程调用ajax
        return logApi.removeById(id)
      }).then((response) => {
        this.fetchData(this.page)
        this.$message.success(response.message || '删除成功')
      })
    },
    // 批量删除
    batchRemove(){
      if (this.selectValue.length === 0){
        this.$message.warning( '请选择要删除记录')
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
          logApi.batchRemove(idList).then(response=>{
            this.fetchData(this.page)
            this.$message.success(response.message || '删除成功')
          })
        })
      }
    },
  }
}
</script>

<style scoped>
.search-div {
  padding:10px;border: 1px solid #EBEEF5;border-radius:3px;
}
.tools-div {
  margin-top: 10px;padding:10px;border: 1px solid #EBEEF5;border-radius:3px;
}

</style>
