<template>
  <page-header-wrapper title="账户别名：Mark">
    <template v-slot:content>
      <a-descriptions size="small" :column="isMobile ? 1 : 2">
        <a-descriptions-item label="秘钥">11213213123123123123213</a-descriptions-item>
        <a-descriptions-item label="交易所">火币</a-descriptions-item>
        <a-descriptions-item label="创建时间">2017-07-07</a-descriptions-item>
      </a-descriptions>
    </template>

    <!-- 预警信息 -->
    <a-card style="margin-top: 24px;" :bordered="false" title="预警信息">
      <a-descriptions>
        <a-descriptions-item label="预警波动率">80%</a-descriptions-item>
        <a-descriptions-item label="预警邮箱">791317255</a-descriptions-item>
        <a-descriptions-item label="预警手机">13686814701</a-descriptions-item>
        <a-descriptions-item label="是否开启">关</a-descriptions-item>
      </a-descriptions>
    </a-card>

    <!-- 操作 -->
    <a-card
      style="margin-top: 24px;"
      :bordered="false"
      :tabList="operationTabList"
      :activeTabKey="operationActiveTabKey"
      @tabChange="
        (key) => {
          this.operationActiveTabKey = key
        }
      "
    >
      <a-table
        v-if="operationActiveTabKey === '1'"
        :columns="operationColumns"
        :dataSource="operation1"
        :pagination="false"
      >
        <template slot="status" slot-scope="status">
          <a-badge :status="status | statusTypeFilter" :text="status | statusFilter" />
        </template>
      </a-table>
      <a-table
        v-if="operationActiveTabKey === '2'"
        :columns="trustOrderColumns"
        :dataSource="operation2"
        :pagination="false"
      >
        <template slot="status" slot-scope="status">
          <a-badge :status="status | statusTypeFilter" :text="status | statusFilter" />
        </template>
      </a-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { baseMixin } from '@/store/app-mixin'

export default {
  name: 'Advanced',
  mixins: [baseMixin],
  data() {
    return {
      tabList: [
        { key: 'detail', tab: '详情' },
        { key: 'rule', tab: '规则' }
      ],
      tabActiveKey: 'detail',

      operationTabList: [
        {
          key: '1',
          tab: '持仓列表'
        },
        {
          key: '2',
          tab: '委托单列表'
        }
      ],
      operationActiveTabKey: '1',

      operationColumns: [
        {
          title: '合约类型',
          dataIndex: 'type',
          key: 'type'
        },
        {
          title: '杠杆倍数',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: '杠杆倍数',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: '多空',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: '持仓量',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: '占用保证金',
          dataIndex: 'name',
          key: 'name'
        },
        // {
        //   title: '执行结果',
        //   dataIndex: 'status',
        //   key: 'status',
        //   scopedSlots: { customRender: 'status' }
        // },
        // {
        //   title: '操作时间',
        //   dataIndex: 'updatedAt',
        //   key: 'updatedAt'
        // },
        {
          title: '浮动盈利',
          dataIndex: 'remark',
          key: 'remark'
        }
      ],

      trustOrderColumns: [
        {
          title: '合约类型',
          dataIndex: 'type',
          key: 'type'
        },
        {
          title: '杠杆倍数',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: '杠杆倍数',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: '多空',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: '持仓量',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: '占用保证金',
          dataIndex: 'name',
          key: 'name'
        },
        // {
        //   title: '执行结果',
        //   dataIndex: 'status',
        //   key: 'status',
        //   scopedSlots: { customRender: 'status' }
        // },
        // {
        //   title: '操作时间',
        //   dataIndex: 'updatedAt',
        //   key: 'updatedAt'
        // },
        {
          title: '浮动盈利',
          dataIndex: 'remark',
          key: 'remark'
        }
      ],

      operation1: [
        {
          key: 'op1',
          type: '订购关系生效',
          name: '曲丽丽',
          status: 'agree',
          updatedAt: '2017-10-03  19:23:12',
          remark: '-'
        },
        {
          key: 'op2',
          type: '财务复审',
          name: '付小小',
          status: 'reject',
          updatedAt: '2017-10-03  19:23:12',
          remark: '不通过原因'
        },
        {
          key: 'op3',
          type: '部门初审',
          name: '周毛毛',
          status: 'agree',
          updatedAt: '2017-10-03  19:23:12',
          remark: '-'
        },
        {
          key: 'op4',
          type: '提交订单',
          name: '林东东',
          status: 'agree',
          updatedAt: '2017-10-03  19:23:12',
          remark: '很棒'
        },
        {
          key: 'op5',
          type: '创建订单',
          name: '汗牙牙',
          status: 'agree',
          updatedAt: '2017-10-03  19:23:12',
          remark: '-'
        }
      ],
      operation2: [
        {
          key: 'op2',
          type: '财务复审',
          name: '付小小',
          status: 'reject',
          updatedAt: '2017-10-03  19:23:12',
          remark: '不通过原因'
        },
        {
          key: 'op3',
          type: '部门初审',
          name: '周毛毛',
          status: 'agree',
          updatedAt: '2017-10-03  19:23:12',
          remark: '-'
        },
        {
          key: 'op4',
          type: '提交订单',
          name: '林东东',
          status: 'agree',
          updatedAt: '2017-10-03  19:23:12',
          remark: '很棒'
        }
      ],
      operation3: [
        {
          key: 'op2',
          type: '财务复审',
          name: '付小小',
          status: 'reject',
          updatedAt: '2017-10-03  19:23:12',
          remark: '不通过原因'
        },
        {
          key: 'op3',
          type: '部门初审',
          name: '周毛毛',
          status: 'agree',
          updatedAt: '2017-10-03  19:23:12',
          remark: '-'
        }
      ]
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        agree: '成功',
        reject: '驳回'
      }
      return statusMap[status]
    },
    statusTypeFilter(type) {
      const statusTypeMap = {
        agree: 'success',
        reject: 'error'
      }
      return statusTypeMap[type]
    }
  },
  methods: {
    handleTabChange(key) {
      console.log('')
      this.tabActiveKey = key
    }
  }
}
</script>

<style lang="less" scoped>
.detail-layout {
  margin-left: 44px;
}
.text {
  color: rgba(0, 0, 0, 0.45);
}

.heading {
  color: rgba(0, 0, 0, 0.85);
  font-size: 20px;
}

.no-data {
  color: rgba(0, 0, 0, 0.25);
  text-align: center;
  line-height: 64px;
  font-size: 16px;

  i {
    font-size: 24px;
    margin-right: 16px;
    position: relative;
    top: 3px;
  }
}

.mobile {
  .detail-layout {
    margin-left: unset;
  }
  .text {
  }
  .status-list {
    text-align: left;
  }
}
</style>
