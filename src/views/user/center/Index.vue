<template>
  <a-card :bordered="false" title="安全设置" :bodyStyle="{ height: '100%' }" :style="{ height: '100%' }">
    <a-list itemLayout="horizontal" :dataSource="data">
      <a-list-item slot="renderItem" slot-scope="item, index" :key="index">
        <a-list-item-meta>
          <a slot="title">{{ item.title }}</a>
          <span slot="description">
            <span class="security-list-description">{{ item.description }}</span>
            <span v-if="item.value"> : </span>
            <span class="security-list-value">{{ item.value }}</span>
          </span>
        </a-list-item-meta>
        <template v-if="item.actions">
          <a slot="actions" @click="item.actions.callback">{{ item.actions.title }}</a>
        </template>
      </a-list-item>
    </a-list>
  </a-card>
</template>

<script>
export default {
  data() {
    return {
      data: [
        {
          title: '账户密码',
          description: '',
          value: '',
          actions: {
            title: '修改',
            callback: () => {
              this.$message.info('This is a normal message')
            }
          }
        },
        {
          title: '我的邮箱',
          description: '已绑定邮箱',
          value: 'ant***sign.com',
          actions: {
            title: '修改',
            callback: () => {
              this.$message.warning('This is message of warning')
            }
          }
        }
      ]
    }
  }
}
</script>

<style scoped>

</style>
