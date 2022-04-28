<template>
  <div>
    <Card>
      <tables ref="tables"
              editable
              searchable
              search-place="top"
              v-model="tableData"
              :columns="columns"
              @on-delete="handleDelete" />
      <Button style="margin: 10px 0;"
              type="primary"
              @click="exportExcel">导出为Csv文件</Button>
    </Card>
  </div>
</template>

<script>
// 获取Tables的数据结构
import Tables from '_c/tables' // 导入了component中的table是，由于HTML中标签的大小写不敏感，即<tables>
import { getTableData } from '@/api/data'// 从mock中读数据，可以不要，自己写一个

export default {
  name: 'tables_page',
  components: {
    Tables
  },
  data () {
    return {
      columns: [{
        title: 'BLOCK',
        key: 'block',
        sortable: true
      },
      {
        title: 'TIME',
        key: 'time',
        editable: true
      },
      {
        title: 'VOLUME',
        key: 'volume'
      },
      {
        title: 'Handle',
        key: 'handle',
        options: ['delete'],
        button: [
          (h, params, vm) => {
            return h(
              'Poptip', {
              props: {
                confirm: true,
                title: '你确定要删除吗?'
              },
              on: {
                'on-ok': () => {
                  vm.$emit('on-delete', params)
                  vm.$emit(
                    'input',
                    params.tableData.filter(
                      (item, index) => index !== params.row.initRowIndex
                    )
                  )
                }
              }
            },
              [h('Button', '自定义删除')]
            )
          }
        ]
      }
      ],
      tableData: []
    }
  },
  methods: {
    handleDelete (params) {
      console.log(params)
    },
    exportExcel () {
      this.$refs.tables.exportCsv({
        filename: `table-${new Date().valueOf()}.csv`
      })
    }
  },

  mounted () {
    // data()调用tableData的key-value
    // this.tableData = [{},{},{},{},{}]
    // 这里是调用data.js中的getTableData()函数，返回值赋给tableData
    // getTableData()函数用的随机方法生成 @name @email

    // getTableData().then(res => {
    //   this.tableData = res.data
    // })

    // const api = "http://localhost:8080/test";
    const api = '/report'

    // 调用axios方法，若收到res,回调成功之后执行函数
    this.axios.post(api, { Message: 'lqy**********' }).then((res) => {
      // 这里的代码是参考level-2-1中写的，下面这两行在这里暂时不需要
      console.log(res.headers.authorization) // 后台要把token改成string
      localStorage.setItem('token', res.headers.authorization)

      // 这里的判断不需要，因为后端没有涉及到token，所以没有获取。
      // if (localStorage.getItem("token") === "undefined")
      // 如果将来后端涉及到token可以在此基础更改
      if (1) {
        // console.log("failed!");

        // 在控制台打印确定是否获取到想要的数据
        console.log('success!')
        console.log(res.data)
        // res.data是获取到的json数据，这里注意json数据格式
        console.log(JSON.parse(JSON.stringify(res.data))['data'][0]['block'])
        console.log(typeof (JSON.parse(JSON.stringify(res.data))['data'][0]['block'])) // string

        // 将获取的json数据填入tableData
        // 这一部分要写到函数里边，res.data为局部变量
        var Block = new Array()
        var Time = new Array()
        var Volume = new Array()

        for (var num = 0; num < 5; num++) {
          console.log(JSON.parse(JSON.stringify(res.data))['data'][num]['block'])
          Block[num] = JSON.parse(JSON.stringify(res.data))['data'][num]['block']
          Time[num] = JSON.parse(JSON.stringify(res.data))['data'][num]['time']
          Volume[num] = JSON.parse(JSON.stringify(res.data))['data'][num]['volume']

          this.tableData.push({
            block: Block[num],
            time: Time[num],
            volume: Volume[num]
          })
        }
      } else {

      }
    })
      .catch((err) => {
        console.log('err:', err.response.data.msg)
      })
  }
}

// 用于测试tableData数据格式，可用this.tableData.push()函数代替
// this.tableData = [
//   {
//     name: userName[0],
//     email: Mail[0],
//     createTime: registerTime[0],
//   },
//   {
//     name: userName[1],
//     email: Mail[1],
//     createTime: registerTime[1],
//   },
//   {
//     name: userName[2],
//     email: Mail[2],
//     createTime: registerTime[2],
//   },
//   {
//     name: userName[3],
//     email: Mail[3],
//     createTime: registerTime[3],
//   },
//   {
//     name: userName[4],
//     email: Mail[4],
//     createTime: registerTime[4],
//   },
// ];
</script>
