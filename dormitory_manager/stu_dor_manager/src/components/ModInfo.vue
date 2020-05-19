<template>
  <div>
    <el-container>
      <!-- 头部 -->
      <el-header>
        <div class="header-left">
          <div class="searchId">
            <el-input placeholder="请输入要查询的学号" v-model="filterObj.stu_num" size="medium" clearable></el-input>
          </div>
          <el-button type="primary" @click="getModifyInfo(filterObj)">查询</el-button>
        </div>
        <div class="header-right">
          <el-button type="primary" @click="dialogAddFormVisible = true">添加</el-button>
          <el-button type="primary" @click="dialogFilterFormVisible = true">筛选数据</el-button>
        </div>
      </el-header>
      <!-- 主体 -->
      <el-main>
        <el-table :data="modifyInfo" stripe style="width: 100%">
          <el-table-column prop="stu_num" min-width="100" label="学号" sortable></el-table-column>
          <el-table-column prop="name" min-width="100" label="名字" sortable></el-table-column>
          <el-table-column prop="pre_dorm_num" min-width="150" label="调整前宿舍号" sortable></el-table-column>
          <el-table-column prop="ch_dorm_num" min-width="150" label="调整后宿舍号" sortable></el-table-column>
          <el-table-column prop="date" min-width="150" label="时间" sortable></el-table-column>
          <el-table-column prop="reason" min-width="100" label="原因" sortable></el-table-column>
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
      <el-form :model="addObj" :rules="rules" ref="addFormRef" label-width="120px" class="form">
        <el-form-item label="学号" prop="stu_num">
          <el-input v-model="addObj.stu_num" size="medium" clearable style="width:auto"></el-input>
        </el-form-item>
        <el-form-item label="调整后宿舍号" prop="ch_dorm_num">
          <el-input v-model="addObj.ch_dorm_num" size="medium" clearable style="width:auto"></el-input>
        </el-form-item>
        <el-form-item label="时间" prop="date">
          <el-date-picker v-model="addObj.date" type="datetime" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
        </el-form-item>
        <el-form-item label="原因" prop="reason">
          <el-input v-model="addObj.reason" size="medium" clearable style="width:auto"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addSubmit">立即添加</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 筛选数据 -->
    <el-dialog title="筛选" width="500px" :visible.sync="dialogFilterFormVisible" @closed="resetForm('filter')">
      <el-form :model="filterObj" label-width="100px" class="form">
        <el-form-item label="学号">
          <el-input v-model="filterObj.stu_num" size="medium" clearable style="width:auto"></el-input>
        </el-form-item>
        <el-form-item label="调整前宿舍号">
          <el-input v-model="filterObj.pre_dorm_num" size="medium" clearable style="width:auto"></el-input>
        </el-form-item>
        <el-form-item label="调整后宿舍号">
          <el-input v-model="filterObj.ch_dorm_num" size="medium" clearable style="width:auto"></el-input>
        </el-form-item>
        <el-form-item label="原因">
          <el-input v-model="filterObj.reason" size="medium" clearable style="width:auto"></el-input>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker
            v-model="modifyDate"
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
          <el-button type="primary" @click="getModifyInfo(filterObj)">确认筛选</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
const searchUrl = '/searchModifyInfo'
const addUrl = '/insertModifyInfo'
export default {
  data() {
    return {
      dialogAddFormVisible: false,  // 添加页面弹窗
      dialogFilterFormVisible: false, // 筛选页面弹窗
      modifyInfo: [],
      addObj: {
        stu_num: '',
        ch_dorm_num: '',
        date: '',
        reason: ''
      },
      filterObj: {},
      currentPage: 1,
      rules: {
        stu_num: [
          {required: true, message: "请输入学号"}
        ],
        ch_dorm_num: [
          {required: true, message: "请输入宿舍号"}
        ],
        date: [
          {required: true, message: "请选择调整日期"}
        ],
        reason: [
          {required: true, message: "请选择原因"}
        ]
      },
      modifyDate: [],
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
      count: 0
    }
  },
  methods: {
    changePage(val) {
      // 下面的分页改变时
      this.currentPage = val
      this.getModifyInfo({pages: val})
    },
    async getModifyInfo(filter = {}) {
      // 获取信息
      try {
        let res = await this.$axios.get(searchUrl, {
          params: {...filter}
        })
        this.modifyInfo = res.data.modifyInfo
        this.count = res.data.count
        this.dialogFilterFormVisible = false
      } catch (error) {
        console.log(error)
      }
    },
    addSubmit() {
      // 添加信息
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          // 不符合表单规则
          return
        }
        try {
          let res = await this.$axios.post(addUrl, this.addObj)
          if (res.status == 200) {
            // 请求成功
            if (res.data.status == 5) {
              // 添加成功
              this.$message.success(res.data.msg)
              this.$emit('refreshAll')  // 添加成功后刷新信息
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
    this.getModifyInfo({pages: 1})
  },
  watch: {
    modifyDate: {
      handler(newTime) {
        this.filterObj.preTime = newTime[0]
        this.filterObj.tailTime = newTime[1]
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