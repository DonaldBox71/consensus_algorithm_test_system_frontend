<!-- 固定表头高度 -->
<style>
.ivu-table th.conlume-style {
  height: 60px;
  font-size: 24px;
}
</style>

<template>
  <!-- 左栏右侧的padding值为10px,右栏左侧的padding值为20px-->
  <Scroll height='1000'>
  <div style="background:#eee;padding: 10px" class='card1'>
    <div id="starter">
    <Card :bordered="false">
      <p slot="title" style="height: 24px; font-size:20px"><b><i>Test Parameters Configuration</i></b></p>
      <div id="configSets">
        <Col>

        <!--下面这些可以用来设定参数：攻击方式、区块大小-->
        <Row>
        <!-- <Col span="1">{{"Block Size："}} </Col> -->
          <Col span="2"
             style="padding-top:6px; height: 40px; font-size: 16px"
             align="left">Block Size</Col>

          <Col span="3"
             style="padding-top:6px; padding-right:20px; height: 40px">
            <Select v-model="blockSize"
                placeholder="Please select block size"
                filterable
                @on-change="chooseBlockSize()">
              <Option v-for="item in blockSizeList"
                  :value="item.value"
                  :key="item.value">{{ item.label }}</Option>
            </Select>
          </Col>

          <Col span="1">{{&nbsp;}} </Col>
          <Col span="3"
             style="padding-top:6px; padding-left:10px; height: 40px; font-size: 16px"
             align="left">Delay Attack</Col>
          <Col span="4"
             style="padding-top:6px; height: 40px; padding-right:20px">
            <Select v-model="delayAttack"
                placeholder="Please choose for delay attack"
                @on-change="chooseDelayAttack()">
              <Option v-for="item in delayAttackChoices"
                  :value="item.value"
                  :key="item.value">{{ item.label }}</Option>
            </Select>
          </Col>

          <Col span="5"
           style="padding-top:5px;padding-left:5px"
           align="right">
          <Button id="starter" @click="startTest()"
              style="height: 40px; width: 120px; font-size: 20px"
              type="primary">Start Test</Button>
        </Col>
        </Row>

        <Row>
        <!-- <Col span="1">{{"Block Size："}} </Col> -->
          <Col span="2"
             style="padding-top:6px; height: 40px; font-size: 16px"
             align="left">Send Rate</Col>

          <Col span="3"
             style="padding-top:6px; padding-right:10px; padding-right:20px; height: 40px">
            <Select v-model="sendRate"
                placeholder="Please select send rate"
                filterable
                @on-change="chooseSendRate()">
              <Option v-for="item in sendRateList"
                  :value="item.value"
                  :key="item.value">{{ item.label }}</Option>
            </Select>
          </Col>

          <Col span="1">{{&nbsp;}} </Col>
          <Col span="3"
             style="padding-top:6px; padding-left:10px; height: 40px; font-size: 16px"
             align="left">Transaction Amount</Col>
          <Col span="4"
             style="padding-top:6px; height: 40px ; padding-right:20px">
            <Select v-model="tAmount"
                placeholder="Please select transaction amount"
                @on-change="chooseTAmount()">
              <Option v-for="item in tAmountList"
                  :value="item.value"
                  :key="item.value">{{ item.label }}</Option>
            </Select>
          </Col>
        </Row>
        </Col>
      </div>
    </Card>
    </div>

    <br>
    
    <div id="result" v-if="resultShow">
      <Card>
        <p slot="title" style="height: 24px; font-size:20px"><b><i>Test Results</i></b></p>
        <Row>
          <Col span="6"
           class="word"
           style="text-align:left; font-size:16px"> Test Start Time: {{ startTime }} </Col>
          <Col span="6"
           class="word"
           style="text-align:left; font-size:16px"> Test End Time: {{ endTime }} </Col>
           <Col></Col>
        </Row>

        <Row>
           <Col span="6"
           class="word"
           style="text-align:left; font-size:16px">Transaction Amount: {{ amount }} </Col>
           <Col span="6"
           class="word"
           style="text-align:left; font-size:16px"> Transaction Amount with Consensus: {{ consensusAmount }} </Col>
        </Row>

        <Row>
          <Col span="6"
           class="word"
           style="text-align:left; font-size:16px"> Average Latency: {{ averageLatency }} seconds</Col>
           <Col span="6"
           class="word"
           style="text-align:left; font-size:16px"> Throughput: {{ throughput }} tps</Col>
        </Row>
        
        <Row>
          <br>
          <Col :span="24" style="padding-right:10px">
          <Table 
             ref="myTable"
             :data="testData"
             :columns="columns_testDataIndex"
             border
             max-height="610" />
          </Col>
        </Row>

        
      </Card>
    </div>
  </div>
  </Scroll>
  


  <!-- 表格 -->
  <!-- <div>
    
  </div> -->

</template>

<script>
import blockSelector from '@/components/block-select'

export default {
  components: {
    blockSelector
  },
  data () {
    return {
      columns_testDataIndex: [
        {
          key: 'tID',
          align: 'center',
          type: 'html',
          width: 270,
          title: '',
          renderHeader: (h, params) => {
            var text = 'Transaction ID'
            return h('div', {
              domProps: {
                innerHTML: text
              },
              style: {
               fontSize: '20px'
              }
            })
          }
        },
        {
          key: 'consensus',
          align: 'center',
          type: 'html',
          width: 300,
          title: '',
          renderHeader: (h, params) => {
            var text = 'Consensus State'
            return h('div', {
              domProps: {
                innerHTML: text
              },
              style: {
                fontSize: '20px'
              }
            })
          }
        },
        {
          key: 'latency',
          align: 'center',
          type: 'html',
          width: 230,
          title: '',
          renderHeader: (h, params) => {
            var text = 'Latency (ms)'
            return h('div', {
              domProps: {
                innerHTML: text
              },
              style: {
                fontSize: '20px'
              }
            })
          }
        },
        {
          key: 'startTime',
          align: 'center',
          type: 'html',
          width: 250,
          title: '',
          renderHeader: (h, params) => {
            var text = 'Start Time'
            return h('div', {
              domProps: {
                innerHTML: text
              },
              style: {
                fontSize: '20px'
              }
            })
          }
        },
        {
          key: 'finishTime',
          align: 'center',
          type: 'html',
          width: 250,
          title: '',
          renderHeader: (h, params) => {
            var text = 'Finish Time'
            return h('div', {
              domProps: {
                innerHTML: text
              },
              style: {
                fontSize: '20px'
              }
            })
          }
        },
        {
          key: 'executedNum',
          align: 'center',
          type: 'html',
          width: 220,
          title: '',
          renderHeader: (h, params) => {
            var text = 'Executed<br/>Amount'
            return h('div', {
              domProps: {
                innerHTML: text
              },
              style: {
               fontSize: '20px'
              }
            })
          }
        },
        {
          key: 'failedNum',
          align: 'center',
          type: 'html',
          width: 220,
          title: '',
          renderHeader: (h, params) => {
            var text = 'Failed<br/>Amount'
            return h('div', {
              domProps: {
                innerHTML: text
              },
              style: {
               fontSize: '20px'
              }
            })
          }
        },
        {
          key: 'finalResult',
          align: 'center',
          type: 'html',
          width: 200,
          title: '',
          renderHeader: (h, params) => {
            var text = 'Final Result'
            return h('div', {
              domProps: {
                innerHTML: text
              },
              style: {
                fontSize: '20px'
              }
            })
          }
        }
      ],

      testData: [],
      startTime: "",
      endTime: "",
      amount: 0,
      consensusAmount: 0,
      averageLatency: 0,
      throughput: 0,

      blockSize: 0,
      delayAttack: 0, // 由于组件限制，无法用T&F，只能用1&0
      sendRate: 0,
      tAmount: 0,

      blockSizeList: [],
      delayAttackChoices: [],
      sendRateList: [],
      tAmountList: [],

      resultShow: false
    }
  },

  mounted () {
    // 初始化一波
    this.testData = []
    this.startTime = ""
    this.endTime = ""
    this.amount = 0
    this.consensusAmount = 0
    this.averageLatency = 0
    this.throughput = 0

    this.resultShow = false
    

    const initConfigsApi = '/initConfigs'
    
    this.axios.get(initConfigsApi).then(res => {
      this.blockSize = res.data['data']['blockSize']
      // this.blockSizeList = res.data['data']['blockSizeList']
      for (let i = 0; i < parseInt(res.data['data']['blockSizeList'].length); i++) {
        const blockSizeFound = {
          value: res.data['data']['blockSizeList'][i],
          label: res.data['data']['blockSizeList'][i].toString() + "KB"
        }
        this.blockSizeList.push(blockSizeFound)
      }

      // delayAttack传bool值，前端转换一下
      if (res.data['data']['delayAttack']) {
        this.delayAttack = 1
      } else {
        this.delayAttack = 0
      }
      this.delayAttackChoices = [
        {value: 1, label: "Open"},
        {value: 0, label: "Close"}
      ]

      this.sendRate = res.data['data']['sendRate']
      for (let i = 0; i < parseInt(res.data['data']['sendRateList'].length); i++) {
        const sendRateFound = {
          value: res.data['data']['sendRateList'][i],
          label: res.data['data']['sendRateList'][i].toString() + "TPS"
        }
        this.sendRateList.push(sendRateFound)
      }

      this.tAmount = res.data['data']['tAmount']
      for (let i = 0; i < parseInt(res.data['data']['tAmountList'].length); i++) {
        const tAmountFound = {
          value: res.data['data']['tAmountList'][i],
          label: res.data['data']['tAmountList'][i].toString() + "Tx"
        }
        this.tAmountList.push(tAmountFound)
      }

    })
    // mounted()的结束括号
  },

  methods: {
    startTest () {
      const api = '/startTest'
      console.log("Start the test")
      // 首先检测一次是否为空，若不为空则清空
      if (this.testData != []) {
          this.testData = []
          this.startTime = ""
          this.endTime = ""
          this.amount = 0
          this.consensusAmount = 0
          this.averageLatency = 0
          this.throughput = 0

          this.resultShow = false
      }
      this.axios.get(api).then(res => {
          // console.log(res.data['data']['startTime'])
          if (res.data['code'] != 200) {
            console.log('The configuration failed! Due to ' + res.data['data'])
          } else {
            for (let i = 0; i < parseInt(res.data['data']['total']); i++) {
              // console.log(res.data['data']['records'][i]['startTime'])
              let obj = {
                  tID:          res.data['data']['records'][i]['tID'],
                  executedNum:  res.data['data']['records'][i]['executedNum'],
                  failedNum:    res.data['data']['records'][i]['failedNum'],
                  consensus:    res.data['data']['records'][i]['consensus'],
                  finalResult:  res.data['data']['records'][i]['finalResult'],
                  startTime:    res.data['data']['records'][i]['startTime'],
                  finishTime:   res.data['data']['records'][i]['finishTime'],
                  latency:      res.data['data']['records'][i]['latency']
              }
              this.testData.push(obj)
            }
            this.startTime = res.data['data']['startTime']
            this.endTime = res.data['data']['endTime']
            this.amount = res.data['data']['amount']
            this.consensusAmount = res.data['data']['consensusAmount']
            this.averageLatency = res.data['data']['averageLatency']
            this.throughput = res.data['data']['throughput']

            this.resultShow = true
          }
      })
    },

    // 配置blockSize
    chooseBlockSize () {
      const api = '/configBlockSize'
      this.axios.post(api, JSON.stringify({blockSize: this.blockSize})).then(res => {
        if (res.data['code'] != 200) {
          console.log('The configuration failed! Due to ' + res.data['data'])
          // 弹窗显示失败
        } else {
          // 弹窗显示成功
          console.log(res.data['msg'])
        }
      })
    },

    chooseDelayAttack () {
      const api = '/configDelayAttack'
      var sign = false
      if (this.delayAttack == 1) {
        sign = true
      }
      this.axios.post(api, JSON.stringify({delayAttack: sign})).then(res => {
        if (res.data['code'] != 200) {
          console.log('The configuration failed! Due to ' + res.data['data'])
          // 弹窗显示失败
        } else {
          // 弹窗显示成功
          console.log(res.data['msg'])
        }
      })
    },

    chooseSendRate () {
      const api = '/configSendRate'
      this.axios.post(api, JSON.stringify({sendRate: this.sendRate})).then(res => {
        if (res.data['code'] != 200) {
          console.log('The configuration failed! Due to ' + res.data['data'])
          // 弹窗显示失败
        } else {
          // 弹窗显示成功
          console.log(res.data['msg'])
        }
      })
    },

    chooseTAmount () {
      const api = '/configTAmount'
      this.axios.post(api, JSON.stringify({tAmount: this.tAmount})).then(res => {
        if (res.data['code'] != 200) {
          console.log('The configuration failed! Due to ' + res.data['data'])
          // 弹窗显示失败
        } else {
          // 弹窗显示成功
          console.log(res.data['msg'])
        }
      })
    }
  }
}
</script>
