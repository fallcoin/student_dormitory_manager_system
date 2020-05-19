<template>
  <div>
      <el-container>
        <!-- 头部 -->
        <el-header>
          <div class="header-left">
            <div class="searchId">
              <el-input placeholder="请输入要查询的宿舍号" v-model="filterObj.dorm_num" size="medium" clearable></el-input>
            </div>
            <el-button type="primary" @click="getDormitorys(filterObj)">查询</el-button>
          </div>
          <div class="header-right">
            <el-button type="primary" @click="dialogAddFormVisible = true">添加</el-button>
            <el-button type="primary" @click="dialogFilterFormVisible = true">筛选数据</el-button>
          </div>
        </el-header>
      <!-- 主体 -->
      <el-main>
        <el-table :data="dormitorys" stripe style="width: 100%">
          <el-table-column prop="dorm_num" label="宿舍号" min-width="100" sortable></el-table-column>
          <el-table-column prop="floor" label="楼层" min-width="100" sortable></el-table-column>
          <el-table-column prop="price" label="价格" min-width="100" sortable></el-table-column>
          <el-table-column prop="ava_bed_num" label="可用床位数" min-width="120" sortable></el-table-column>
          <el-table-column fixed="right" label="操作" min-width="100">
            <template slot-scope="scope">
              <el-button @click="getDetail(scope.row)" type="text" size="medium">详情</el-button>
              <el-button @click="edit(scope.row)" type="text" size="medium">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <!-- 底部 -->
      <el-footer>
        <!-- 一页显示10行信息 -->
        <el-pagination background layout="prev, pager, next, jumper" :page-count="Math.ceil(count/10)" :current-page="currentPage" @current-change="changePage"></el-pagination>
      </el-footer>
    </el-container>
    <!-- 添加数据 -->
    <el-dialog title="添加" width="500px" :visible.sync="dialogAddFormVisible" @closed="resetForm('add')">
      <el-form :model="addObj" label-width="80px" class="form" :rules="rules" ref="addFormRef">
        <el-form-item label="楼层" prop="floor">
          <el-input v-model.number="addObj.floor" size="medium" clearable style="width:auto"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input v-model.number="addObj.price" size="medium" clearable style="width:auto"></el-input>
        </el-form-item>
        <el-form-item label="个数" prop="num">
          <el-input v-model.number="addObj.num" size="medium" clearable style="width:auto"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addSubmit(addObj)">立即添加</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 编辑数据 -->
    <el-dialog title="编辑" width="500px" :visible.sync="dialogEditFormVisible" @closed="resetForm('edit')">
      <el-form :model="editObj" label-width="90px" class="form" :rules="rules">
        <el-form-item label="宿舍号">
          <el-input v-model="editObj.dorm_num" size="medium" clearable style="width:auto" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="楼层">
          <el-input v-model="editObj.floor" size="medium" clearable style="width:auto" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input v-model.number="editObj.price" size="medium" clearable style="width:auto"></el-input>
        </el-form-item>
        <el-form-item label="可用床位数">
          <el-input v-model="editObj.ava_bed_num" size="medium" clearable style="width:auto" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="updateDormitory(editObj)">确认修改</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 筛选数据 -->
    <el-dialog title="筛选" width="500px" :visible.sync="dialogFilterFormVisible" @closed="resetForm('filter')">
      <el-form :model="filterObj" label-width="90px" class="form" ref="filterFormRef">
        <el-form-item label="宿舍号">
          <el-input v-model="filterObj.dorm_num" size="medium" clearable style="width:auto"></el-input>
        </el-form-item>
        <el-form-item label="楼层">
          <el-input v-model="filterObj.floor" size="medium" clearable style="width:auto"></el-input>
        </el-form-item>
        <el-form-item label="价格">
          <el-input v-model="filterObj.price" size="medium" clearable style="width:auto"></el-input>
        </el-form-item>
        <el-form-item label="可用床位数">
          <el-input v-model="filterObj.ava_bed_num" size="medium" clearable style="width:auto"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getDormitorys(filterObj)">确认筛选</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="详细信息" width="500px" :visible.sync="dialogDetailFormVisible" @closed="detail = []">
      <el-table :data="detail">
        <el-table-column label="学号" prop="stu_num"></el-table-column>
        <el-table-column label="姓名" prop="name"></el-table-column>
        <el-table-column label="年级" prop="grade"></el-table-column>
        <el-table-column label="学院" prop="fac"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
const searchUrl = '/searchDormitory'
const updateUrl = '/modifyDormitory'
const insertUrl = '/insertDormitory'
const getDetailUrl = '/getDetail'
export default {
  data() {
    return {
      dormitorys: [], // 宿舍信息
      currentPage: 1, // 当前页数
      dialogAddFormVisible: false,  // 添加页面弹窗
      dialogEditFormVisible: false, // 编辑页面弹窗
      dialogFilterFormVisible: false, // 筛选页面弹窗
      dialogDetailFormVisible: false, // 宿舍详细信息页面弹窗
      addObj: {
        floor: '',
        price: '',
        num: ''
      }, // 新增宿舍信息对象
      filterObj: {},  // 查询宿舍信息对象
      editObj: {},  // 编辑宿舍信息对象
      rules: {  // 表单约束规则
        floor: [
          {type: "number", min: 1, max: 6, message: "请输入正确的楼层"}
        ],
        num: [
          {required: true, message: "请输入要增加的楼层数"},
          {type: "number", min: 1, message: "请输入正确的数字"}
        ],
        price: [
          {type: "number", min: 0, message: "请输入正确的价格"}
        ],
        ava_bed_num: [
          {type: "number", min: 0, max: 4, message: "请输入正确的床位数"}
        ]
      },
      detail: [], // 宿舍详细信息,是个数组,里面是舍员信息
      count: 0  // 信息总条数
    }
  },
  methods: {
    edit(row) {
      // 用户点击编辑
      this.dialogEditFormVisible = true
      this.editObj = row
    },
    changePage(val) {
      // 下面的分页改变时
      this.currentPage = val
      this.getDormitorys({pages: val})
    },
    async getDormitorys(filter = {}) {
      // 查询
      try {
        const res = await this.$axios.get(searchUrl, {
          params: {...filter}
        })
        this.dormitorys = res.data.dormitorys
        this.count = res.data.count
        this.dialogFilterFormVisible = false
      } catch (error) {
        console.log(error)
      }
    },
    async updateDormitory(editObj) {
      // 更新
      this.$refs.editFormRef.validate(async valid => {
        if (!validate) {
          return
        }
        try {
          const res = await this.$axios.post(updateUrl, this.editObj)
          if (res.status == 200) {
            this.$message.success('更新成功')
            this.$emit('refreshAll')  // 更新完后刷新信息
          }
          this.dialogEditFormVisible = false
        } catch (error) {
          console.log(error)
        }
      })
    },
    addSubmit(addObj) {
      // 添加
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return
        }
        try {
          const res = await this.$axios.post(insertUrl, this.addObj)
          if (res.status == 200) {
            this.$message.success('添加成功')
            this.$emit('refreshAll')  // 添加完后刷新信息
          }
          this.dialogAddFormVisible = false
        } catch (error) {
          console.log(error)
        }
      })
    },
    async getDetail(row) {
      // 获取宿舍详细信息
      this.dialogDetailFormVisible = true
      let dorm_num = row.dorm_num
      try {
        const res = await this.$axios.get(getDetailUrl, {
          params: {
            dorm_num
          }
        })
        this.detail = res.data
      } catch (error) {
        console.log(error)
      }
    },
    resetForm(ref) {
      // 重置表单信息
      switch (ref) {
        case 'add': {
          this.$refs.addFormRef.resetFields()
        } break
        case 'filter': {
          this.filterObj = {}
        } break
        default:
          break;
      }
    }
  },
  created() {
    // 在创建时获取第一页的信息
    this.getDormitorys({pages: 1})
  }
}
</script>

<style scoped>
.el-header {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
}
.el-footer {
  text-align: center;
}
.header-left, .header-right{
  display: flex;
  align-items: center;
}
.searchId {
  margin-right: 20px;
}
.form {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>