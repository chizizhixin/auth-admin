<template>
  <div class="app-container">
    订单列表
    <div class="search-div">
      <el-form label-width="70px" size="small">
        <el-row>
          <el-col :span="8">
            <el-form-item label="关 键 字">
              <el-input style="width: 95%" v-model="searchObj.keyword" placeholder="分类"></el-input>
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
      <el-button type="success" icon="el-icon-plus" size="mini"  @click="add">添 加</el-button>
    </div>

    <!-- 列表 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      stripe
      border
      style=" width: 100%; margin-top: 10px;">

      <el-table-column
        label="序号"
        width="70"
        align="center">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="number" label="订单号" width="180"/>
      <el-table-column prop="phone" label="电话" width="140"/>
      <el-table-column prop="user_name" label="用户名" width="120"/>
      <el-table-column
        prop="type"
        label="标签"
        width="150"
        :filters="[{ text: '未支付', value: 0 },{ text: '微信', value: 1 }, { text: '支付宝', value: 2 }]"
        :filter-method="filterTag"
        filter-placement="bottom-end">
        <template slot-scope="scope">
          <el-tag
            type="primary" v-if="scope.row.payMethod === 0"
            disable-transitions>未支付</el-tag>
          <el-tag
            type="success" v-if="scope.row.payMethod === 1"
            disable-transitions>微信</el-tag>
          <el-tag
            type="success" v-else
            disable-transitions>支付宝</el-tag>
        </template>
      </el-table-column>

      <!--      <el-table-column prop="image" label="图片" align="center">-->
      <!--        <template slot-scope="{ row }">-->
      <!--          <el-image style="width: auto; height: 40px; border:none;cursor: pointer;"-->
      <!--                    :src="row.image"-->
      <!--                    :preview-src-list="[ `/common/download?name=${row.image}` ]" >-->
      <!--            &lt;!&ndash;            <div slot="error" class="image-slot">&ndash;&gt;-->
      <!--            &lt;!&ndash;              <img src="./../../images/noImg.png"  style="width: auto; height: 40px; border:none;" >&ndash;&gt;-->
      <!--            &lt;!&ndash;            </div>&ndash;&gt;-->
      <!--          </el-image>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <!--      <el-table-column-->
      <!--        prop="type"-->
      <!--        label="标签"-->
      <!--        width="110"-->
      <!--        :filters="[{ text: '菜品', value: 1 }, { text: '套餐', value: 2 }]"-->
      <!--        :filter-method="filterTag"-->
      <!--        filter-placement="bottom-end">-->
      <!--        <template slot-scope="scope">-->
      <!--          <el-tag-->
      <!--            type="primary" v-if="scope.row.type === 1"-->
      <!--            disable-transitions>菜品</el-tag>-->
      <!--          <el-tag-->
      <!--            type="success" v-else-->
      <!--            disable-transitions>套餐</el-tag>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <!--      <el-table-column prop="createUser" label="创建人" width="110" />-->
      <!--      <el-table-column prop="updateUser" label="修改人" width="110" />-->
      <el-table-column label="状态" width="120">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status === 1"
            @change="switchStatus(scope.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="165px" />
      <el-table-column prop="updateTime" label="修改时间" width="165px" />
      <el-table-column label="操作"  align="center" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit(scope.row.id)" title="修改"/>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeDataById(scope.row.id)" title="删除" />
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
    <el-dialog title="添加/修改" :visible.sync="dialogVisible" width="40%" >
      <el-form ref="dataForm" :model="sysUser"  label-width="100px" size="small" style="padding-right: 40px;">
        <el-form-item label="类型名称" prop="name">
          <el-input v-model="sysUser.name"/>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="sysUser.type" placeholder="请选择类型">
            <el-option label="菜品" value="1"></el-option>
            <el-option label="套餐" value="2"></el-option>
          </el-select>
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
import api from '@/api/order/order'
import apiDetail from '@/api/order/orderDetail'
import {mapGetters} from "vuex";
const defaultForm = {
  id: '',
  number:'',
  payMethod: '',
  amount: '',
  remark:'',
  userName:'',
  phone:'',
  address:'',
  consignee:'',
  status: '',//订单状态 1待付款，2待派送，3已派送，4已完成，5已取消
}
export default {
  data(){
    return{
      listLoading: false, // 数据是否正在加载
      list: null, // banner列表
      total: 0, // 数据库中的总记录数
      page: 1, // 默认页码
      limit: 10, // 每页记录数
      searchObj: {}, // 查询表单对象
      createTimes: [],
      updateTimes:[],
      dialogVisible: false,
      sysUser: defaultForm,

      dialogRoleVisible: false,
      allRoles: [], // 所有角色列表
      userRoleIds: [], // 用户的角色ID的列表
      isIndeterminate: false, // 是否是不确定的
      checkAll: false, // 是否全选
      addUser: false,
      options: [{
        value: '2',
        label: '支付宝'
      }, {
        value: '1',
        label: '微信'
      },{
        value: '0',
        label: '未支付'
      }],
    }
  },
  created() {
    //调用列表方法
    this.fetchData()
    this.sysUser.update_user = this.id
    console.log(this.sysUser.update_user)
  },
  computed: {
    ...mapGetters([
      'name',
      'id',
    ])
  },
  methods:{
    filterTag(value, row) {
      return row.payMethod === value;
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
      api.getPageList(this.page, this.limit, this.searchObj).then(
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
    //添加
    add(){
      this.dialogVisible = true
      this.sysUser = {}
    },
    //保存添加或者修改
    saveOrUpdate(){
      if (!this.sysUser.id){
        this.save()
      }else {
        this.update()
      }
    },
    save(){
      this.sysUser.updateUser = this.id
      api.save(this.sysUser)
        .then(response=>{
          //提示信息
          this.$message.success('操作成功')
          //关闭弹框
          this.dialogVisible = false
          //刷新页面
          this.fetchData()
        })
    },
    update(){
      this.sysUser.updateUser = this.id
      api.update(this.sysUser).then(response=>{
        //提示信息
        this.$message.success('操作成功')
        //关闭弹框
        this.dialogVisible = false
        //刷新页面
        this.fetchData()
      })
    },
    edit(id){
      this.dialogVisible = true
      this.addUser = false
      api.getCategoryId(id).then(response=>{
        console.log(response.data)
        this.sysUser = response.data
        console.log(response.data)
        // this.sysUser.update_user = this.id
      })
      // apiSysUser.getById(id).then(response=>{
      //   this.sysUser = response.data
      // })
    },
    removeDataById(id){
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => { // promise
        // 点击确定，远程调用ajax
        return api.removeById(id)
      }).then((response) => {
        this.fetchData(this.page)
        this.$message.success(response.message || '删除成功')
      })
    },
    //修改用户状态
    switchStatus(row){
      row.status = row.status === 1 ? 0 : 1
      api.updateStatus(row.id, row.status).then(response => {
        if (response.code) {
          this.$message.success(response.message || '操作成功')
          this.fetchData()
        }
      })
    },
    //批量删除
    // batchRemove(){
    //   if (this.selectValue.length == 0){
    //     this.$message.warning( '请选择要删除记录')
    //     return
    //   }else {
    //     this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
    //       confirmButtonText: '确定',
    //       cancelButtonText: '取消',
    //       type: 'warning'
    //     }).then(() => {
    //       var idList = []
    //       for (var i = 0;i<this.selectValue.length;i++){
    //         var obj = this.selectValue[i]
    //         var id = obj.id
    //         idList.push(id)
    //       }
    //       api.batchRemove(idList).then(response=>{
    //         this.fetchData(this.page)
    //         this.$message.success(response.message || '删除成功')
    //       })
    //     })
    //   }
    // },


    /*
    全选勾选状态发生改变的监听
    */
    handleCheckAllChange (value) {// value 当前勾选状态true/false
      // 如果当前全选, userRoleIds就是所有角色id的数组, 否则是空数组
      this.userRoleIds = value ? this.allRoles.map(item => item.id) : []
      // 如果当前不是全选也不全不选时, 指定为false
      this.isIndeterminate = false
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
.pageList {
  text-align: center;
  margin-top: 30px;
}
</style>
