<template>
  <div>
    <Row :gutter="20">
      <i-col :xs="12"
             :md="8"
             :lg="4"
             v-for="(infor, i) in inforCardData"
             :key="`infor-${i}`"
             style="height: 120px;padding-bottom: 10px;">
        <infor-card shadow
                    :color="infor.color"
                    :icon="infor.icon"
                    :icon-size="36">
          <count-to :end="infor.count"
                    count-class="count-style" />
          <p>{{ infor.title }}</p>
        </infor-card>
      </i-col>
    </Row>
    <Row :gutter="20"
         style="margin-top: 10px;">
      <i-col :md="24"
             :lg="10"
             style="margin-bottom: 20px;">
        <Card shadow>
          <chart-pie v-if="pieData!=0"
                     ref="pie"
                     style="height: 300px;"
                     :value="pie"
                     text="住户每周用水分布"></chart-pie>
          <!-- 添加渲染判断条件 -->
        </Card>
      </i-col>
      <i-col :md="24"
             :lg="16"
             style="margin-bottom: 20px;">
        <Card shadow>
          <chart-bar style="height: 300px;"
                     :value="barData"
                     text="每周用户活跃量" />
        </Card>
      </i-col>
      <i-col :md="24"
             :lg="16"
             style="margin-bottom: 20px;">
        <Card shadow>
          <chart-line style="height: 300px;"
                      :value="lineData"
                      text="每周住户用水量变化" />
          <!-- 新增组件，组件代码在src/components/charts/pie.vue -->
        </Card>
      </i-col>
    </Row>
    <Row>
      <Card shadow>
        <example style="height: 310px;" />
      </Card>
    </Row>
  </div>
</template>

<script>

import InforCard from '_c/info-card'
import CountTo from '_c/count-to'
import { ChartPie, ChartBar, ChartLine } from '_c/charts'
import Example from './example.vue'
export default {
  name: 'home',
  components: {
    InforCard,
    CountTo,
    ChartPie,
    ChartBar,
    ChartLine,
    Example
  },
  data () {
    return {
      inforCardData: [
        { title: '新增用户', icon: 'md-person-add', count: 803, color: '#2d8cf0' },
        { title: '累计点击', icon: 'md-locate', count: 232, color: '#19be6b' },
        { title: '新增问答', icon: 'md-help-circle', count: 142, color: '#ff9900' },
        { title: '分享统计', icon: 'md-share', count: 657, color: '#ed3f14' },
        { title: '新增互动', icon: 'md-chatbubbles', count: 12, color: '#E46CBB' },
        { title: '新增页面', icon: 'md-map', count: 14, color: '#9A66E4' }
      ],
      pieData: [
        //  { value: 335, name: '直接访问' },
        //  { value: 310, name: '邮件营销' },
        //  { value: 234, name: '联盟广告' },
        //  { value: 135, name: '视频广告' },
        //  { value: 1548, name: '搜索引擎' }
      ],
      barData: {
        Mon: 13253,
        Tue: 34235,
        Wed: 26321,
        Thu: 12340,
        Fri: 24643,
        Sat: 1322,
        Sun: 1324
      },
      lineData: {
        Mon: 13253,
        Tue: 34235,
        Wed: 26321,
        Thu: 12340,
        Fri: 24643,
        Sat: 1322,
        Sun: 1324
      }
    }
  },
  computed: {
    pie () {
      return this.pieData
    }
    // line(){
    //   return this.lineData
    // }
  },
  mounted () {
    this.buildData()// 数据解析函数，方便代码管理
  },

  methods: {
    buildData: function () {
      const api = '/waterchart'
      this.axios.post(api, { Message: 'lqy**********' }).then((res) => {
        console.log('res is :', res)
        const data = res.data.data
        for (let i of data) {
          let obj1 = {
            value: i.waterconsumption,
            name: i.time
          }// 对应饼图数据列表格式
          console.log('item', obj1)
          this.pieData.push(obj1)
          console.log('pieData', this.pieData)

          // if (i.usetype=="生活用水"){
          //   let obj2= {
          //     yAxis:i.waterconsumption,
          //     xAxis:i.time
          //    //i.time:i.waterconsumption,
          // //   }
          //   console.log("item",obj2)
          //   this.lineData.push(obj2)
          //   this.le.log("lineData",this.lineData)
        }
      }).catch((err) => {
        console.log('err:', err.response.data.msg)
      })
    }
  }
}
</script>

<style lang="less">
.count-style {
  font-size: 50px;
}
</style>
