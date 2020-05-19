<template>
  <div>
    <el-container>
      <!-- 头部 -->
      <el-header>
        <div class="header-left">
          <div class="searchId">
            <el-input placeholder="请输入要查询的学号" v-model="filterObj.stu_num" size="medium" clearable></el-input>
          </div>
          <el-button type="primary">查询</el-button>
        </div>
        <div class="header-right">
          <el-button type="primary" @click="dialogAddFormVisible = true">添加</el-button>
          <el-button type="primary" @click="dialogFilterFormVisible = true">筛选数据</el-button>
        </div>
      </el-header>
      <!-- 主体 -->
      <el-main>
        <el-table :data="inOutInfo" stripe style="width: 100%">
          <el-table-column prop="stu_num" label="学号" min-width="100" sortable></el-table-column>
          <el-table-column prop="name" label="名字" min-width="100" sortable></el-table-column>
          <el-table-column prop="dorm_num" label="所住宿舍号" min-width="150" sortable></el-table-column>
          <el-table-column prop="left_time" label="离开时间" min-width="150" sortable></el-table-column>
          <el-table-column prop="back_time" label="回来时间" min-width="150" sortable></el-table-column>
          <el-table-column prop="is_over_time" label="是否晚归" min-width="100" sortable></el-table-column>
        </el-table>
      </el-main>
      <!-- 底部 -->
      <el-footer>
        <!-- 一行显示10页信息 -->
        <el-pagination background layout="prev, pager, next, jumper" :page-count="Math.ceil(count/10)" :current-page="currentPage" @current-change="changePage"></el-pagination>
      </el-footer>
    </el-container>
    <!-- 添加数据 -->
    <el-dialog title="添加" :visible.sync="dialogAddFormVisible" width="500px" @closed="resetForm('add')">
      <el-form :model="addObj" ref="addFormRef" :rules="rules" label-width="100px" class="form">
        <el-form-item label="学号" prop="stu_num">
          <el-input v-model="addObj.stu_num" size="medium" clearable style="width:auto"></el-input>
        </el-form-item>
        <el-form-item label="离开时间" prop="left_time">
          <el-date-picker v-model="addObj.left_time" type="datetime" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
        </el-form-item>
        <el-form-item label="回来时间" prop="back_time">
          <el-date-picker v-model="addObj.back_time" type="datetime" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
        </el-form-item>
        <el-form-item label="是否晚归" prop="is_over_time">
          <el-radio-group v-model="addObj.is_over_time">
            <el-radio label="是"></el-radio>
            <el-radio label="否"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addSubmit(addObj)">立即添加</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 筛选数据 -->
    <el-dialog title="筛选" :visible.sync="dialogFilterFormVisible" width="700px" @closed="resetForm('filter')">
      <el-form :model="filterObj" label-width="100px" class="form">
        <el-form-item label="学号">
          <el-input v-model="filterObj.stu_num" size="medium" clearable style="width:auto"></el-input>
        </el-form-item>
        <el-form-item label="离开时间">
          <el-date-picker
            v-model="outDate"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            align="right">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="回来时间">
          <el-date-picker
            v-model="inDate"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            align="right">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="是否晚归">
          <el-radio-group v-model="filterObj.is_over_time">
            <el-radio label="男"></el-radio>
            <el-radio label="女"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getInOutInfo(filterObj)">确认筛选</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
const searchUrl = '/searchInOutInfo'
const insertUrl = '/insertInOutInfo'
export default {
  data() {
    return {
      dialogAddFormVisible: false,  // 添加页面弹窗
      dialogFilterFormVisible: false, // 筛选页面弹窗
      inOutInfo: [],  // 学生出入信息
      addObj: {
        stu_num: '',
        left_time: '',
        back_time: '',
        is_over_time: ''
      }, // 新增出入信息对象
      filterObj: {},  // 查询出入信息对象
      currentPage: 1, //当前页数
      pickerOptions: {  // 时间快捷选项
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
      inDate: [], // 回来的时间
      outDate: [],  // 出去的时间
      rules: {  // 表单约束规则
        stu_num: [
          {required: true, message: "请输入学号"}
        ],
        left_time: [
          {required: true, message: "请选择离开时间"}
        ]
      },
      count: 0  // 信息总条数
    }
  },
  methods: {
    changePage(val) {
      // 下面的分页改变时
      this.currentPage = val
      this.getInOutInfo({pages: 1})
    },
    addSubmit() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return
        }
        try {
          const res = await this.$axios.post(insertUrl, this.addObj)
          if (res.status == 200) {
            if (res.data.status == 2) {
              // 添加成功
              this.$message.success(res.data.msg)
              this.$emit('refreshAll')  // 新增信息后刷新信息
            } else {
              // 添加失败
              this.$message.error(res.data.msg)
            }
          }
          this.dialogAddFormVisible = false
        } catch (error) {
          console.log(error)
        }
      })
    },
    async getInOutInfo(filter = {}) {
      try {
        const res = await this.$axios.get(searchUrl, {
          params: {...filter}
        })
        this.inOutInfo = res.data.inOutInfo
        this.count = res.data.count
      } catch (error) {
        console.log(error)
      }
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
        default:
          break;
      }
    }
  },
  created() {
    // 在创建时获取第一页的信息
    this.getInOutInfo({pages: 1})
  },
  watch: {
    inDate: {
      handler(newTime) {
        this.filterObj.preInTime = newTime[0]
        this.filterObj.tailInTime = newTime[1]
      },
      deep: true
    },
    outDate: {
      handler(newTime) {
        this.filterObj.preOutTime = newTime[0]
        this.filterObj.tailOutTime = newTime[1]
      },
      deep: true
    }
  }
}
</script>

<style>
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