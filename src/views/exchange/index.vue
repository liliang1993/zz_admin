<template>
  <page-header-wrapper>
    <a-row :gutter="24" type="flex">
      <a-col>
        <a-card class="search-list-wrapper">
          <div class="search-opera-wrapper">
            <a-input-search placeholder="输入交易所名称" @search="onSearch" />
          </div>

          <div class="exchange-list-wrapper">
            <div
              :class="['exchange-list-item', currentExchangeId == item.exchange_id ? 'exchange-list-item--active' : '']"
              v-for="(item, index) in exchangeList"
              :key="index"
              @click="handleSearchListItem(item)"
            >
              {{ item.exchange_name }}
            </div>
          </div>
        </a-card>
      </a-col>
      <a-col :flex="1">
        <a-card :bordered="false">
          <div class="table-page-search-wrapper">
            <a-form layout="inline">
              <a-row :gutter="48">
                <a-col :md="8" :sm="24">
                  <a-form-item label="账户别名">
                    <a-input v-model="queryParam.account_name" placeholder="" />
                  </a-form-item>
                </a-col>
                <!-- <a-col :md="8" :sm="24">
                  <a-form-item label="交易所名称">
                    <a-select v-model="queryParam.exchange_id" placeholder="请选择" default-value="0">
                      <a-select-option v-for="item in exchangeList" :key="item.exchange_id">
                        {{ item.exchange_name }}
                      </a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col> -->
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
            :rowKey="(record) => record.account_id"
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
                <a-popconfirm
                  title="确定删除？"
                  ok-text="确定"
                  cancel-text="取消"
                  @confirm="handleDeleteAccount(record)"
                >
                  <a href="#" @click.stop>删除</a>
                </a-popconfirm>

                <a-divider type="vertical" />
                <a @click.stop="handleSub(record)">预警设置</a>
              </template>
            </span>
          </s-table>

          <create-form
            ref="createModal"
            title="新增账户"
            :visible="visible"
            :loading="confirmLoading"
            :model="mdl"
            @cancel="handleCancel"
            @ok="handleOk"
          />
          <!--edit model-->
          <create-form
            ref="editModal"
            title="修改账户"
            :type="1"
            :visible="editVisible"
            :loading="editConfirmLoading"
            :model="editMdl"
            @cancel="handleCancelEdit"
            @ok="handleOkEdit"
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
      </a-col>
    </a-row>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import { getExchangeList } from '@/api/login'
import { getAccountList, addAccount, deleteAccount, modifyAccount } from '@/api/account'

import StepByStepModal from '@/views/list/modules/StepByStepModal'
import CreateForm from '@/views/list/modules/CreateForm'
import WarningForm from '@/views/list/modules/WarningForm'

const columns = [
  // {
  //   title: '#',
  //   scopedSlots: { customRender: 'serial' }
  // },
  {
    title: '账户别名',
    width: '100px',
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
  // {
  //   title: '总资金量',
  //   width: '100px',
  //   dataIndex: 'status1'
  // },
  // {
  //   title: '涨跌幅',
  //   width: '100px',
  //   dataIndex: 'status2'
  // },
  // {
  //   title: '当前收益',
  //   width: '100px',
  //   dataIndex: 'status3'
  // },
  // {
  //   title: '保证金',
  //   width: '100px',
  //   dataIndex: 'status4'
  // },
  // {
  //   title: '是否预警',
  //   width: '100px',
  //   dataIndex: 'status5'
  // },
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
      // edit model
      editVisible: false,
      editConfirmLoading: false,
      editMdl: null,
      // warning model
      warningVisible: false,
      // 操作时的当前account_id
      account_id: '',
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: { account_name: '' },
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        console.log('parameter', parameter)
        const { pageNo, pageSize } = parameter
        const requestParameters = {
          page_number: pageNo,
          page_size: pageSize,
          ...this.queryParam,
          exchange_id: this.currentExchangeId
        }
        console.log('loadData request parameters:', requestParameters)
        return getAccountList(requestParameters).then((res) => {
          return res
        })
      },
      selectedRowKeys: [],
      selectedRows: [],
      exchangeLoading: true,
      exchangeList: [],
      currentExchangeId: ''
    }
  },
  filters: {
    filterExchange(id) {
      return exchangeMap.find((item) => item.exchange_id === id)['exchange_name']
    }
  },
  created() {
    // getRoleList({ t: new Date() })
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
    handleSearchListItem(item) {
      if (item.exchange_id !== this.currentExchangeId) {
        this.currentExchangeId = item.exchange_id
        this.$refs.table.refresh()
      }
    },

    handleAdd() {
      this.mdl = null
      this.visible = true
    },

    handleEdit(record) {
      this.editVisible = true
      console.log('handleEdit', record)
      this.account_id = record.account_id
      this.editMdl = { ...record }
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

    handleCancelEdit() {
      this.editVisible = false
      const form = this.$refs.editModal.form
      form.resetFields() // 清理表单数据（可不做）
    },

    handleOkEdit() {
      const form = this.$refs.editModal.form
      this.editConfirmLoading = true
      form.validateFields((errors, values) => {
        if (!errors) {
          console.log('values', values)
          const params = {
            ...values,
            account_id: this.account_id
          }
          modifyAccount(params)
            .then(() => {
              this.editVisible = false
              this.editConfirmLoading = false
              // 重置表单数据
              form.resetFields()
              // 刷新表格
              this.$refs.table.refresh()

              this.$message.info('账号编辑成功')
            })
            .catch((e) => {
              this.editConfirmLoading = false
              console.log('err', e)
            })
        } else {
          this.editConfirmLoading = false
        }
      })
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
          this.currentExchangeId = this.exchangeList[0] && this.exchangeList[0].exchange_id
          this.$refs.table.refresh()
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
        account_name: ''
      }
    },

    handleRowClick(record) {
      const { account_id, account_name } = record
      this.$router.push({ name: 'DetailAccount', params: { account_id }, query: { account_name } })
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

<style lang="less">
@import '~ant-design-vue/es/style/themes/default.less';
.search-list-wrapper {
  height: 800px;
  /deep/ .ant-card-body {
    padding: 0px;
  }
  .search-opera-wrapper {
    padding: 5px;
  }
}
.exchange-list-item {
  display: flex;
  align-items: center;
  height: 40px;
  padding: 0 20px;
  &--active {
    background-color: @alert-info-bg-color;
    border-color: @alert-info-border-color;
  }
  &:hover {
    background-color: @alert-info-bg-color;
  }
}
</style>
