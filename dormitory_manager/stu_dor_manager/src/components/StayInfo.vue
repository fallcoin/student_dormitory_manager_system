<template>
  <div>
    <el-container>
      <!-- 头部 -->
      <el-header>
          <el-button type="primary" @click="dialogAddFormVisible = true">添加</el-button>
          <el-button type="primary" @click="dialogAddAllFormVisible = true">一键分配</el-button>
          <el-button type="primary" @click="dialogFilterFormVisible = true">筛选数据</el-button>
      </el-header>
    <!-- 主体 -->
      <el-main>
        <el-table :data="stayMsg" stripe style="width: 100%">
          <el-table-column prop="stu_num" label="学号" min-width="100" sortable></el-table-column>
          <el-table-column prop="name" label="姓名" min-width="100" sortable></el-table-column>
          <el-table-column prop="grade" label="年级" min-width="100" sortable></el-table-column>
          <el-table-column prop="fac" label="学院" min-width="100" sortable></el-table-column>
          <el-table-column prop="dorm_num" label="宿舍号" min-width="100" sortable></el-table-column>
          <el-table-column prop="date" label="时间" min-width="100" sortable></el-table-column>
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
      <el-form :model="addObj" label-width="80px" ref="addFormRef" :rules="rules" class="form">
        <el-form-item label="学号" prop="stu_num">
          <el-input v-model="addObj.stu_num" size="medium" clearable style="width:auto"></el-input>
        </el-form-item>
        <el-form-item label="宿舍号" prop="dorm_num">
          <el-input v-model="addObj.dorm_num" size="medium" clearable style="width:auto"></el-input>
        </el-form-item>
        <el-form-item label="日期" prop="date">
          <el-date-picker v-model="addObj.date" type="datetime" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addSubmit">立即添加</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 筛选数据 -->
    <el-dialog title="筛选" width="600px" :visible.sync="dialogFilterFormVisible" @closed="resetForm('filter')">
      <el-form :model="filterObj" label-width="90px" class="form">
        <el-form-item label="学号">
          <el-input v-model="filterObj.stu_num" size="medium" clearable style="width:auto"></el-input>
        </el-form-item>
        <el-form-item label="宿舍号">
          <el-input v-model="filterObj.dorm_num" size="medium" clearable style="width:auto"></el-input>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker
            v-model="stayDate"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            align="right">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getStayInfo(filterObj)">确认筛选</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 一键添加 -->
    <el-dialog width="400px" title="一键添加" :visible.sync="dialogAddAllFormVisible" @closed="resetForm('addAll')">
      <el-form :model="addAllConfig" ref="addAllFormRef" :rules="rules" label-width="90px" class="form">
        <el-form-item label="日期" prop="date">
          <el-date-picker v-model="addAllConfig.date" type="datetime" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
        </el-form-item>
        <el-form-item label="分配方式" prop="mode">
          <el-select v-model="addAllConfig.mode" placeholder="请选择分配方式">
            <el-option label="按年级分配" value="grade"></el-option>
            <el-option label="按学院分配" value="fac"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="insertAllStudent(addAllConfig)">确认分配</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
const searchUrl = '/seachStayInfo'
const insertUrl = '/insertStayInfo'
export default {
  data() {
    return {
      dialogAddFormVisible: false,  // 添加页面弹窗
      dialogFilterFormVisible: false, // 筛选页面弹窗
      dialogAddAllFormVisible: false,
      stayMsg: [],
      currentPage: 1,
      addObj: {
        stu_num: '',
        dorm_num: '',
        date: ''
      },
      filterObj: {},
      pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
      },
      stayDate: [],
      addAllConfig: {
        date: '',
        mode: ''
      },
      rules: {
        stu_num: [
          {required: true, message: "请输入学号"}
        ],
        dorm_num: [
          {required: true, message: "请输入宿舍号"}
        ],
        date: [
          {required: true, message: "请选择入住日期"}
        ],
        mode: [
          {required: true, message: "请选择分配方式"}
        ]
      },
      count: 0
    }
  },
  methods: {
    changePage(val) {
      // 下面的分页改变时
      this.currentPage = val
      this.getStayInfo({pages: val})
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
            if (res.data.status == 3) {
              this.$message.success(res.data.msg)
              this.$emit('refreshAll') // 添加后刷新信息
            } else {
              this.$message.error(res.data.msg)
            }
          }
          this.dialogAddFormVisible = false
        } catch (error) {
          console.log(error)
        }
      })
    },
    async getStayInfo(filter = {}) {
      // 查询
      try {
        const res = await this.$axios.get(searchUrl, {
          params: {...filter}
        })
        this.stayMsg = res.data.stayInfo
        this.count = res.data.count
        this.stayDate = []
        this.dialogFilterFormVisible = false
      } catch (error) {
        console.log(error)
      }
    },
    insertAllStudent(mode) {
      this.$refs.addAllFormRef.validate(async valid => {
        if (!valid) {
          return
        }
        try {
          const res = await this.$axios.post('/insertAllstudent', this.addAllConfig)
          if (res.status == 200) {
            this.$message.success(res.data.msg)
            this.$emit('refreshAll')  // 添加后刷新信息
          }
          this.dialogAddAllFormVisible = false
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
        case 'addAll': {
          this.$refs.addAllFormRef.resetFields()
        } break
        default:
          break;
      }
    }
  },
  created() {
    // 在创建时获取第一页的信息
    this.getStayInfo({pages: 1})
  },
  watch: {
    stayDate: {
      handler(newTime) {
        this.filterObj.preTime = newTime[0]
        this.filterObj.tailTime = newTime[1]
      },
      deep: true
    }
  }
}
</script>

<style scoped>
.el-header {
  margin-top: 10px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.el-footer {
  text-align: center;
}
.form {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>