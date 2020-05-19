<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick" type="card" tab-position="left">
      <el-tab-pane label="学生信息" name="first">
        <StuInfo ref="stuInfoRef" @refreshAll="refresh"/>
      </el-tab-pane>
      <el-tab-pane label="宿舍信息" name="second">
        <DorInfo ref="dorInfoRef" @refreshAll="refresh"/>
      </el-tab-pane>
      <el-tab-pane label="入住信息" name="third">
        <StayInfo ref="stayInfoRef" @refreshAll="refresh"/>
      </el-tab-pane>
      <el-tab-pane label="调整信息" name="fourth">
        <ModInfo ref="modInfoRef" @refreshAll="refresh"/>
      </el-tab-pane>
      <el-tab-pane label="出入信息" name="five">
        <InOutInfo ref="inOutInfoRef" @refreshAll="refresh"/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import StuInfo from './StuInfo'
import DorInfo from './DorInfo'
import ModInfo from './ModInfo'
import StayInfo from './StayInfo'
import InOutInfo from './InOutInfo'

export default {
  data() {
    return {
      activeName: 'first'
    }
  },
  methods: {
    handleClick(tab, event) {
    },
    refresh() { // 更新数据
      this.$refs.stuInfoRef.getStudents({pages: 1})
      this.$refs.dorInfoRef.getDormitorys({pages: 1})
      this.$refs.stayInfoRef.getStayInfo({pages: 1})
      this.$refs.modInfoRef.getModifyInfo({pages: 1})
      this.$refs.inOutInfoRef.getInOutInfo({pages: 1})
    }
  },
  components: {
    StuInfo,
    DorInfo,
    ModInfo,
    StayInfo,
    InOutInfo
  }
}
</script>

<style scoped>

</style>