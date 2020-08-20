<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="账户别名">
                <a-input v-model="queryParam.account_name" placeholder="" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="交易所名称">
                <a-select v-model="queryParam.exchange_id" placeholder="请选择" default-value="0">
                  <!-- <a-spin v-if="exchangeLoading" slot="notFoundContent" size="small" /> -->
                  <a-select-option v-for="item in exchangeList" :key="item.exchange_id">
                    {{ item.exchange_name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <!-- <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="调用次数">
                  <a-input-number v-model="queryParam.callNo" style="width: 100%"/>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="更新日期">
                  <a-date-picker v-model="queryParam.date" style="width: 100%" placeholder="请输入更新日期"/>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="使用状态">
                  <a-select v-model="queryParam.useStatus" placeholder="请选择" default-value="0">
                    <a-select-option value="0">全部</a-select-option>
                    <a-select-option value="1">关闭</a-select-option>
                    <a-select-option value="2">运行中</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="使用状态">
                  <a-select placeholder="请选择" default-value="0">
                    <a-select-option value="0">全部</a-select-option>
                    <a-select-option value="1">关闭</a-select-option>
                    <a-select-option value="2">运行中</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </template> -->
            <a-col :md="(!advanced && 8) || 24" :sm="24">
              <span
                class="table-page-search-submitButtons"
                :style="(advanced && { float: 'right', overflow: 'hidden' }) || {}"
              >
                <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
                <a-button style="margin-left: 8px;" @click="resetSearchForm">重置</a-button>
                <!-- <a @click="toggleAdvanced" style="margin-left: 8px">
                  {{ advanced ? '收起' : '展开' }}
                  <a-icon :type="advanced ? 'up' : 'down'"/>
                </a> -->
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <div class="table-operator">
        <a-button type="primary" icon="plus" @click="handleAdd">新建</a-button>
        <a-dropdown v-action:edit v-if="selectedRowKeys.length > 0">
          <a-menu slot="overlay">
            <a-menu-item key="1"><a-icon type="delete" />删除</a-menu-item>
            <!-- lock | unlock -->
            <a-menu-item key="2"><a-icon type="lock" />锁定</a-menu-item>
          </a-menu>
          <a-button style="margin-left: 8px;"> 批量操作 <a-icon type="down" /> </a-button>
        </a-dropdown>
      </div>

      <s-table
        ref="table"
        size="default"
        rowKey="key"
        :columns="columns"
        :data="loadData"
        :customRow="
          (record) => {
            return {
              on: {
                click: (event) => {
                  handleRowClick(record)
                }
              }
            }
          }
        "
        showPagination="auto"
      >
        <span slot="exchange" slot-scope="text">
          {{ text | filterExchange }}
        </span>

        <span slot="action" slot-scope="text, record">
          <template>
            <a @click.stop="handleEdit(record)">修改</a>
            <a-divider type="vertical" />
            <a-popconfirm title="确定删除？" ok-text="确定" cancel-text="取消" @confirm="handleDeleteAccount(record)">
              <a href="#" @click.stop>删除</a>
            </a-popconfirm>

            <a-divider type="vertical" />
            <a @click.stop="handleSub(record)">预警设置</a>
          </template>
        </span>
      </s-table>

      <create-form
        ref="createModal"
        :visible="visible"
        :loading="confirmLoading"
        :model="mdl"
        @cancel="handleCancel"
        @ok="handleOk"
      />

      <warning-form
        ref="waningModal"
        :visible="warningVisible"
        :loading="confirmLoading"
        :model="mdl"
        @cancel="handleWarningCancel"
        @ok="handleWarningOk"
      />

      <step-by-step-modal ref="modal" @ok="handleOk" />
    </a-card>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import { getRoleList, getServiceList } from '@/api/manage'
import { getExchangeList } from '@/api/login'
import { getAccountList, addAccount, deleteAccount, modifyAccount } from '@/api/account'

import StepByStepModal from './modules/StepByStepModal'
import CreateForm from './modules/CreateForm'
import WarningForm from './modules/WarningForm'

const columns = [
  // {
  //   title: '#',
  //   scopedSlots: { customRender: 'serial' }
  // },
  {
    title: '账户别名',
    dataIndex: 'account_name'
  },
  {
    title: 'Access Key',
    dataIndex: 'account_api_key'
  },
  {
    title: 'Secret Key',
    dataIndex: 'account_private_key'
  },
  {
    title: '交易所',
    dataIndex: 'exchange_id',
    scopedSlots: { customRender: 'exchange' }
  },
  {
    title: '总资金量',
    dataIndex: 'status1'
  },
  {
    title: '涨跌幅',
    dataIndex: 'status2'
  },
  {
    title: '当前收益',
    dataIndex: 'status3'
  },
  {
    title: '保证金',
    dataIndex: 'status4'
  },
  {
    title: '是否预警',
    dataIndex: 'status5'
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '200px',
    scopedSlots: { customRender: 'action' }
  }
]

const exchangeMap = [
  { exchange_id: 1, exchange_name: 'huobi' },
  { exchange_id: 2, exchange_name: 'okex' }
]

const statusMap = {
  0: {
    status: 'default',
    text: '关闭'
  },
  1: {
    status: 'processing',
    text: '运行中'
  },
  2: {
    status: 'success',
    text: '已上线'
  },
  3: {
    status: 'error',
    text: '异常'
  }
}

export default {
  name: 'TableList',
  components: {
    STable,
    Ellipsis,
    CreateForm,
    WarningForm,
    StepByStepModal
  },
  data() {
    this.columns = columns
    return {
      // create model
      visible: false,
      confirmLoading: false,
      mdl: null,
      // warning model
      warningVisible: false,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: { account_name: '', exchange_id: '' },
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        console.log('parameter', parameter)
        const { pageNo, pageSize } = parameter
        const requestParameters = { page_number: pageNo, page_size: pageSize, ...this.queryParam }
        console.log('loadData request parameters:', requestParameters)
        return getAccountList(requestParameters).then((res) => {
          return res
        })
      },
      selectedRowKeys: [],
      selectedRows: [],
      exchangeLoading: true,
      exchangeList: []
    }
  },
  filters: {
    filterExchange(id) {
      return exchangeMap.find((item) => item.exchange_id === id)['exchange_name']
    },
    statusFilter(type) {
      return statusMap[type].text
    },
    statusTypeFilter(type) {
      return statusMap[type].status
    }
  },
  created() {
    getRoleList({ t: new Date() })
    this.fetchGetExchangeList() // 获得交易所列表选项
  },
  computed: {
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange
      }
    }
  },
  methods: {
    handleAdd() {
      this.mdl = null
      this.visible = true
    },

    handleEdit(record) {
      this.visible = true
      console.log('handleEdit', record)
      this.mdl = { ...record }
    },

    handleOk() {
      const form = this.$refs.createModal.form
      this.confirmLoading = true
      form.validateFields((errors, values) => {
        if (!errors) {
          console.log('values', values)
          addAccount(values)
            .then(() => {
              this.visible = false
              this.confirmLoading = false
              // 重置表单数据
              form.resetFields()
              // 刷新表格
              this.$refs.table.refresh()

              this.$message.info('账号新增成功')
            })
            .catch((e) => {
              this.confirmLoading = false
              console.log('err', e)
            })
        } else {
          this.confirmLoading = false
        }
      })
    },

    handleCancel() {
      this.visible = false

      const form = this.$refs.createModal.form
      form.resetFields() // 清理表单数据（可不做）
    },

    handleWarningOk() {},

    handleWarningCancel() {
      this.warningVisible = false
      const form = this.$refs.createModal.form
      form.resetFields() // 清理表单数据（可不做）
    },

    fetchGetExchangeList() {
      getExchangeList()
        .then((res) => {
          this.exchangeList = res
          console.log('res', res)
        })
        .catch((e) => {
          console.log('err', e)
        })
    },

    handleSub(record) {
      this.warningVisible = true
    },

    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },

    toggleAdvanced() {
      this.advanced = !this.advanced
    },

    resetSearchForm() {
      this.queryParam = {
        account_name: '',
        exchange_id: ''
      }
    },

    handleRowClick(record) {
      const { id } = record
      this.$router.push({ name: 'DetailAccount', params: { id } })
      console.log('record', record)
    },

    handleDeleteAccount(record) {
      console.log('record', record)
      // const { account_id } = record
      deleteAccount({
        account_id: record.account_id
      })
        .then((res) => {
          console.log('res', res)
          this.$refs.table.refresh()
          this.$message.info('删除成功')
        })
        .catch((err) => {
          console.log('err', err)
        })
    }
  }
}
</script>
