<template>
  <div>
    <el-container>
      <!-- 头部 -->
      <el-header>
        <div class="header-left">
          <div class="searchId">
            <el-input placeholder="请输入要查询的id" v-model="filterObj.stu_num" size="medium" clearable></el-input>
          </div>
          <el-button type="primary" @click="getStudents(filterObj)">查询</el-button>
        </div>
        <div class="header-right">
          <el-button type="primary" @click="dialogAddFormVisible = true">添加</el-button>
          <el-button type="primary" @click="dialogFilterFormVisible = true">筛选数据</el-button>
          <el-button type="danger" @click="deleteStudent(multipleSelectionId)">删除所选</el-button>
        </div>
      </el-header>
      <!-- 主体 -->
      <el-main>
        <el-table :data="students" stripe style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="stu_num" label="学号" min-width="100" sortable></el-table-column>
          <el-table-column prop="name" label="名字" min-width="100"></el-table-column>
          <el-table-column prop="sex" label="性别" min-width="100" sortable></el-table-column>
          <el-table-column prop="phone" label="手机号码" min-width="150"></el-table-column>
          <el-table-column prop="age" label="年龄" min-width="100" sortable></el-table-column>
          <el-table-column prop="grade" label="年级" min-width="100" sortable></el-table-column>
          <el-table-column prop="fac" label="学院" min-width="100" sortable></el-table-column>
          <el-table-column fixed="right" label="操作" width="100">
            <template slot-scope="scope">
              <el-button @click="edit(scope.row)" type="text" size="medium">编辑</el-button>
              <el-button @click="deleteStudent([scope.row.stu_num])" type="text" size="medium">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <!-- 底部 -->
      <el-footer>
        <!-- 一页显示10行 -->
        <el-pagination background layout="prev, pager, next, jumper" :page-count="Math.ceil(count/10)" :current-page="currentPage" @current-change="changePage"></el-pagination>
      </el-footer>
    </el-container>
    <!-- 添加数据 -->
    <el-dialog title="添加" width="500px" :visible.sync="dialogAddFormVisible" @closed="resetForm('add')">
      <el-form :model="addObj" label-width="80px" :rules="rules" ref="addFormRef" class="form">
        <el-form-item label="名字" prop="name">
          <el-input v-model="addObj.name" size="medium" clearable style="width:auto"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="addObj.sex">
            <el-radio label="男"></el-radio>
            <el-radio label="女"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="addObj.phone" size="medium" clearable style="width:auto"></el-input>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model.number="addObj.age" size="medium" clearable style="width:auto"></el-input>
        </el-form-item>
        <el-form-item label="年级" prop="grade">
          <el-input v-model.number="addObj.grade" size="medium" clearable style="width:auto"></el-input>
        </el-form-item>
        <el-form-item label="学院" prop="fac">
          <el-select v-model="addObj.fac" placeholder="请选择学院">
            <el-option label="计算机学院" value="计算机学院"></el-option>
            <el-option label="土木工程学院" value="土木工程学院"></el-option>
            <el-option label="电子信息学院" value="电子信息学院"></el-option>
            <el-option label="外国语学院" value="外国语学院"></el-option>
            <el-option label="大数据学院" value="大数据学院"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addSubmit(addObj)">立即添加</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 编辑数据 -->
    <el-dialog title="编辑" width="500px" :visible.sync="dialogEditFormVisible" @closed="resetForm('edit')">
      <el-form :model="editObj" label-width="80px" class="form" ref="editFormRef" :rules="rules">
        <el-form-item label="学号" prop="stu_num">
          <el-input v-model="editObj.stu_num" size="medium" clearable style="width:auto" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="名字" prop="name">
          <el-input v-model="editObj.name" size="medium" clearable style="width:auto"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="editObj.sex">
            <el-radio label="男"></el-radio>
            <el-radio label="女"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="editObj.phone" size="medium" clearable style="width:auto"></el-input>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model.number="editObj.age" size="medium" clearable style="width:auto"></el-input>
        </el-form-item>
        <el-form-item label="年级" prop="grade">
          <el-input v-model.number="editObj.grade" size="medium" clearable style="width:auto"></el-input>
        </el-form-item>
        <el-form-item label="学院" prop="fac">
          <el-select v-model="editObj.fac" placeholder="请选择学院">
            <el-option label="计算机学院" value="计算机学院"></el-option>
            <el-option label="土木工程学院" value="土木工程学院"></el-option>
            <el-option label="电子信息学院" value="电子信息学院"></el-option>
            <el-option label="外国语学院" value="外国语学院"></el-option>
            <el-option label="大数据学院" value="大数据学院"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="updateStudent(editObj)">确认修改</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 筛选数据 -->
    <el-dialog title="筛选" width="500px" :visible.sync="dialogFilterFormVisible" @closed="resetForm('filter')">
      <el-form :model="filterObj" label-width="80px" class="form">
        <el-form-item label="学号">
          <el-input v-model="filterObj.stu_num" size="medium" clearable style="width:auto"></el-input>
        </el-form-item>
        <el-form-item label="名字">
          <el-input v-model="filterObj.name" size="medium" clearable style="width:auto"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="filterObj.sex">
            <el-radio label="男"></el-radio>
            <el-radio label="女"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="手机号码">
          <el-input v-model="filterObj.phone" size="medium" clearable style="width:auto"></el-input>
        </el-form-item>
        <el-form-item label="年龄">
          <el-input v-model="filterObj.age" size="medium" clearable style="width:auto"></el-input>
        </el-form-item>
        <el-form-item label="年级">
          <el-input v-model="filterObj.grade" size="medium" clearable style="width:auto"></el-input>
        </el-form-item>
        <el-form-item label="学院">
          <el-select v-model="filterObj.fac" placeholder="请选择学院">
            <el-option label="计算机学院" value="计算机学院"></el-option>
            <el-option label="土木工程学院" value="土木工程学院"></el-option>
            <el-option label="电子信息学院" value="电子信息学院"></el-option>
            <el-option label="外国语学院" value="外国语学院"></el-option>
            <el-option label="大数据学院" value="大数据学院"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getStudents(filterObj)">确认筛选</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
const searchUrl = '/searchStudent'
const updateUrl = '/modifyStudent'
const deleteUrl = '/deleteStudent'
const insertUrl = '/insertStudent'
export default {
  data() {
    return {
      students: [], // 数据
      multipleSelectionId: [],  // 复选框选中的id
      currentPage: 1,  // 当前页数
      dialogAddFormVisible: false,  // 添加页面弹窗
      dialogEditFormVisible: false, // 编辑页面弹窗
      dialogFilterFormVisible: false, // 筛选页面弹窗
      addObj: {
        stu_num: '',
        name: '',
        fac: '',
        sex: '',
        grade: '',
        phone: ''
      }, // 要添加的对象
      editObj: {},  // 要编辑的对象
      filterObj: {}, // 要筛选的条件对象
      rules: {  // 表单约束规则
        name: [
          {required: true, type: "string", message: '请输入名字', trigger: 'blur'}
        ],
        sex: [
          { required: true, message: '请选择性别', trigger: 'change' }
        ],
        grade: [
          {required: true, type: "number", message: '请填写年级', trigger: 'blur'},
          {min: 2000, type: "number", max: (new Date()).getFullYear(), message: '请填写正确的年级', trigger: 'blur'}
        ],
        fac: [
          {required: true, message: '请选择学院', trigger: 'change'}
        ]
      },
      count: 0  // 信息总条数
    }
  },
  methods: {
    handleSelectionChange(val) {
      // 复选框改变时
      this.multipleSelectionId = val.map(current => current.stu_num)
    },
    edit(row) {
      // 用户点击编辑
      this.dialogEditFormVisible = true
      this.editObj = row
    },
    changePage(val) {
      // 下面的分页改变时
      this.currentPage = val
      this.getStudents({pages: val})
    },
    async deleteStudent(multipleSelectionId) {
      // 删除
      try {
        const res = await this.$axios.post(deleteUrl, {multipleSelectionId: multipleSelectionId.join(',')})
        if (res.status == 200) {
          this.$message.success("删除成功")
          this.$emit('refreshAll')  // 删除后刷新信息
        }
      } catch (error) {
        console.log(error)
      }
    },
    async getStudents(filter = {}) {
      // 查询
      try {
        const res = await this.$axios.get(searchUrl, {
          params: {...filter}
        })
        this.students = res.data.students
        this.count = res.data.count
        this.dialogFilterFormVisible = false
      } catch (error) {
        console.log(error)
      }
    },
    updateStudent(editObj) {
      // 更新
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) {
          return
        }
        try {
          const res = await this.$axios.post(updateUrl, this.editObj)
          if (res.status == 200) {
            this.$message.success("更新成功")
            this.$emit('refreshAll') 
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
            this.$message.success("添加成功")
            this.$emit('refreshAll')  // 添加后刷新信息
          }
          this.dialogAddFormVisible = false
        } catch (error) {
          console.log(error)
        } 
      })
    },
    resetForm(ref) {
      // 重置表单
      switch (ref) {
        case 'add': {
          this.$refs.addFormRef.resetFields()
        } break
        case 'filter': {
          this.filterObj = {}
        } break
        case 'edit': {
          this.$refs.editFormRef.resetFields()
        } break
        default:
          break;
      }
    }
  },
  created() {
    // 在创建时获取第一页的信息
    this.getStudents({pages: 1})
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
.header-left, .header-right {
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