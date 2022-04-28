<template>
  <div>
    <div v-if="searchable && searchPlace === 'top'"
         class="search-con search-con-top">
      <Select v-model="searchKey"
              class="search-col"
              style="margin-left:0%">
        <Option v-for="item in columns.slice(0,3)"
                :value="item.key"
                :key="`search-col-${item.key}`">{{ item.title }}</Option>
      </Select>
      <Input v-if="searchKey !== 'access'"
             @on-change="handleClear"
             clearable
             placeholder="输入关键字搜索"
             class="search-input"
             v-model="searchValue" />
      <Select v-if="searchKey === 'access'"
              v-model="searchValue"
              @on-change="handleClear1"
              clearable
              class="search-col1">
        <Option v-for="item in list"
                :value="item.label"
                :key="`search-col-${item.label}`">{{ item.label }}</Option>
      </Select>
      <Button @click="handleSearch"
              class="search-btn"
              type="primary"
              style="padding-left:10px; margin-left:1%">搜索</Button>
      <Button @click="value3 = true"
              class="search-btn"
              type="primary"
              style="padding-left:15px; margin-left:1%">添加新用户</Button>
      <!-- 联调之后再注释掉手动加载 -->
      <!-- <Button @click="update_tabledata" class="search-btn" type="dashed" style="padding-left:200px;padding-right:200px; margin-left:7%"><Icon type="md-cloud-download" />&nbsp;&nbsp;加载数据</Button> -->
      <Drawer title="添加新用户"
              v-model="value3"
              width="300"
              :mask-closable="false"
              :styles="styles">
        <Form ref="formValidate"
              :model="formData"
              :rules="ruleValidate">
          <FormItem label="工号"
                    prop='number'
                    label-position="top">
            <Input v-model="formData.number"
                   placeholder="请输入工号(格式：8位数字)" />
          </FormItem>
          <FormItem label="用户名"
                    prop='name'
                    label-position="top">
            <Input v-model="formData.name"
                   placeholder="请输入用户名" />
          </FormItem>
          <FormItem label="权限"
                    prop='access'
                    label-position="top">
            <Select v-model="formData.access"
                    placeholder="请选择用户权限"
                    multiple>
              <Option value="超级管理员">超级管理员</Option>
              <Option value="普通管理员">普通管理员</Option>
              <Option value="录入人">录入人</Option>
              <Option value="审核人">审核人</Option>
              <Option value="审定人">审定人</Option>
            </Select>
          </FormItem>
        </Form>
        <div class="demo-drawer-footer">
          <Button style="margin-left: 20%"
                  @click=" addrow()">确定</Button>
          <Button type="primary"
                  @click="value3 = false;setzero()"
                  style="margin-left:20%">取消</Button>
        </div>
      </Drawer>

    </div>
    <Table ref="tablesMain"
           :data="insideTableData"
           :columns="insideColumns"
           :stripe="stripe"
           :border="border"
           :show-header="showHeader"
           :width="width"
           :height="height"
           :loading="loading"
           :disabled-hover="disabledHover"
           :highlight-row="highlightRow"
           :row-class-name="rowClassName"
           :size="size"
           :no-data-text="noDataText"
           :no-filtered-data-text="noFilteredDataText"
           @on-current-change="onCurrentChange"
           @on-select="onSelect"
           @on-select-cancel="onSelectCancel"
           @on-select-all="onSelectAll"
           @on-selection-change="onSelectionChange"
           @on-sort-change="onSortChange"
           @on-filter-change="onFilterChange"
           @on-row-click="onRowClick"
           @on-row-dblclick="onRowDblclick"
           @on-expand="onExpand">
      <slot name="header"
            slot="header"></slot>
      <slot name="footer"
            slot="footer"></slot>
      <slot name="loading"
            slot="loading"></slot>
    </Table>

    <a id="hrefToExportTable"
       style="display: none;width: 0px;height: 0px;"></a>
  </div>
</template>

<script>
import commonIconVue from '../common-icon/common-icon.vue'
import TablesEdit from './edit.vue'
import handleBtns from './handle-btns'
import './index.less'

const url = ''


export default {
  name: 'Tables',
  props: {
    value: {
      type: Array,
      default () {
        return []
      }
    },
    columns: {
      type: Array,
      default () {
        return []
      }
    },
    size: String,
    width: {
      type: [Number, String]
    },
    height: {
      type: [Number, String]
    },
    stripe: {
      type: Boolean,
      default: false
    },
    border: {
      type: Boolean,
      default: false
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    highlightRow: {
      type: Boolean,
      default: false
    },
    rowClassName: {
      type: Function,
      default () {
        return ''
      }
    },
    context: {
      type: Object
    },
    noDataText: {
      type: String
    },
    noFilteredDataText: {
      type: String
    },
    disabledHover: {
      type: Boolean
    },
    loading: {
      type: Boolean,
      default: false
    },
    /**
     * @description 全局设置是否可编辑
     */
    editable: {
      type: Boolean,
      default: false
    },
    /**
     * @description 是否可搜索
     */
    searchable: {
      type: Boolean,
      default: false
    },
    /**
     * @description 搜索控件所在位置，'top' / 'bottom'
     */
    searchPlace: {
      type: String,
      default: 'top'
    }
  },
  /**
   * Events
   * @on-start-edit 返回值 {Object} ：同iview中render函数中的params对象 { row, index, column }
   * @on-cancel-edit 返回值 {Object} 同上
   * @on-save-edit 返回值 {Object} ：除上面三个参数外，还有一个value: 修改后的数据
   */
  data () {
    return {
      value3: false,
      styles: {
        height: 'calc(100% - 55px)',
        overflow: 'auto',
        paddingBottom: '53px',
        position: 'static'
      },
      formData: {
        number: '',
        name: '',
        access: ''
      },
      ruleValidate: {
        // ID:[{required: true, len:8, message: '必须为8位数字', trigger: 'blur'}],
        name: [{ required: true, message: '必须为汉字', trigger: 'blur' }],
        access: [{ required: true, type: 'array', min: 1, message: '至少选1个权限', trigger: 'change' }]
      },
      list: [

        {
          label: '超级管理员'
        },
        {

          label: '普通管理员'
        },
        {
          label: '录入人'
        },
        {
          label: '审定人'
        },
        {
          label: '审核人'
        }
      ],
      insideColumns: [],
      insideTableData: [],
      edittingCellId: '',
      edittingText: '',
      searchValue: '',
      searchKey: ''
    }
  },
  methods: {
    update_tabledata () {
      this.axios.get(url + '/root/query_all_user').then(res => {
        this.insideTableData = []
        console.log(res.data)
        console.log('__________________')
        res.data.forEach(item => {
          console.log(item)
          this.insideTableData.push({
            number: item['number'],
            name: item['name'],
            access: JSON.parse(item['access'])['access']
          })
        })
      })
    },
    suportEdit (item, index) {
      item.render = (h, params) => {
        return h(TablesEdit, {
          props: {
            params: params,
            value: this.insideTableData[params.index][params.column.key],
            edittingCellId: this.edittingCellId,
            editable: this.editable
          },
          on: {
            'input': val => {
              this.edittingText = val
            },
            'on-start-edit': (params) => {
              this.edittingCellId = `editting-${params.index}-${params.column.key}`
              this.$emit('on-start-edit', params)
            },
            'on-cancel-edit': (params) => {
              this.edittingCellId = ''
              this.$emit('on-cancel-edit', params)
            },
            'on-save-edit': (params) => {
              this.value[params.row.initRowIndex][params.column.key] = this.edittingText
              this.$emit('input', this.value)
              this.$emit('on-save-edit', Object.assign(params, { value: this.edittingText }))
              this.edittingCellId = ''
            }
          }
        })
      }
      return item
    },
    surportHandle (item) {
      let options = item.options || []
      let insideBtns = []
      options.forEach(item => {
        if (handleBtns[item]) insideBtns.push(handleBtns[item])
      })
      let btns = item.button ? [].concat(insideBtns, item.button) : insideBtns
      item.render = (h, params) => {
        params.tableData = this.value
        return h('div', btns.map(item => item(h, params, this)))
      }
      return item
    },
    handleColumns (columns) {
      this.insideColumns = columns.map((item, index) => {
        let res = item
        if (res.editable) res = this.suportEdit(res, index)
        if (res.key === 'handle') res = this.surportHandle(res)
        return res
      })
    },
    setDefaultSearchKey () {
      this.searchKey = this.columns[0].key !== 'handle' ? this.columns[0].key : (this.columns.length > 1 ? this.columns[1].key : '')
    },
    handleClear (e) {
      if (e.target.value === '')
      // this.insideTableData = this.value
      { this.update_tabledata() }
    },
    handleClear1 (e) {
      if (e == undefined)
      // this.insideTableData = this.value
      { this.update_tabledata() }
    },
    handleSearch () {
      this.insideTableData = this.insideTableData.filter(item => item[this.searchKey].indexOf(this.searchValue) > -1)
    },
    addrow () {
      this.$refs.formValidate.validate((valid) => {
        let access_js = {
          access: this.formData.access
        }
        let data = {
          number: this.formData.number,
          name: this.formData.name,
          access: JSON.stringify(access_js)
        }

        if (valid) {
          this.$Modal.confirm({
            title: '操作确认',
            content: '请再次确认添加的信息是否准确无误？',
            onCancel: () => {
              this.$Message.info('取消操作!')
            },
            onOk: () => {
              this.axios.post(url + '/root/new_user', data).then(res => {
                this.update_tabledata()
                this.$Message.success({ content: '添加新用户成功！', duration: 2 })
                this.value3 = false
                this.setzero()
              }).catch(e => {
                this.$Message.error({ content: '添加新用户失败:请稍后再次尝试！', duration: 2 })
                this.value3 = false
                this.setzero()
              })
            }
          })
        } else {
          this.$Message.error({ content: '添加信息格式不正确！', duration: 2 })
        }
      })
    },
    setzero () {
      this.formData = {
        number: '',
        name: '',
        access: ''
      }
    },
    handleTableData () {
      this.insideTableData = this.value.map((item, index) => {
        let res = item
        res.initRowIndex = index
        return res
      })
    },
    exportCsv (params) {
      this.$refs.tablesMain.exportCsv(params)
    },
    clearCurrentRow () {
      this.$refs.talbesMain.clearCurrentRow()
    },
    onCurrentChange (currentRow, oldCurrentRow) {
      this.$emit('on-current-change', currentRow, oldCurrentRow)
    },
    onSelect (selection, row) {
      this.$emit('on-select', selection, row)
    },
    onSelectCancel (selection, row) {
      this.$emit('on-select-cancel', selection, row)
    },
    onSelectAll (selection) {
      this.$emit('on-select-all', selection)
    },
    onSelectionChange (selection) {
      this.$emit('on-selection-change', selection)
    },
    onSortChange (column, key, order) {
      this.$emit('on-sort-change', column, key, order)
    },
    onFilterChange (row) {
      this.$emit('on-filter-change', row)
    },
    onRowClick (row, index) {
      this.$emit('on-row-click', row, index)
    },
    onRowDblclick (row, index) {
      this.$emit('on-row-dblclick', row, index)
    },
    onExpand (row, status) {
      this.$emit('on-expand', row, status)
    }
  },
  watch: {
    columns (columns) {
      this.handleColumns(columns)
      this.setDefaultSearchKey()
    },
    value (val) {
      this.handleTableData()
      if (this.searchable) this.handleSearch()
    }
  },
  mounted () {
    this.update_tabledata() // 后端联调完之后再切换
    this.handleColumns(this.columns)
    this.setDefaultSearchKey()
    this.handleTableData()
  }
}
</script>
