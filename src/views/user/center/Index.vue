<template>
  <div>
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
    <modify-password-form
      ref="modifyPasswordModal"
      :visible="modifyPasswordVisible"
      :loading="modifyPasswordLoading"
      :model="mdl"
      @cancel="handleCancel"
      @ok="handleOk"
    >
    </modify-password-form>
  </div>
</template>

<script>
import { modifyPassword } from '@/api/login'
import { mapState } from 'vuex'
import ModifyPasswordForm from './modules/ModifyPasswordForm'
export default {
  components: {
    ModifyPasswordForm
  },
  data() {
    return {
      modifyPasswordVisible: false,
      modifyPasswordLoading: false,
      mdl: null,
      data: []
    }
  },
  computed: {
    ...mapState({
      user_info: state => state.user.user_info
    })
  },
  created() {
    this.data = [
      {
        title: '账户密码',
        description: '',
        value: '',
        actions: {
          title: '修改',
          callback: () => {
            this.modifyPasswordVisible = true
          }
        }
      },
      {
        title: '我的邮箱',
        description: '已绑定邮箱',
        value: this.user_info.email
      }
    ]
  },
  methods: {
    handleCancel() {
      this.modifyPasswordVisible = false
    },
    handleOk() {
      const form = this.$refs.modifyPasswordModal.form
      //   this.modifyPasswordLoading = true
      form.validateFields((errors, values) => {
        if (!errors) {
          console.log('values', values)
          modifyPassword(values)
            .then(res => {
              this.$store.dispatch('Logout').then(() => {
                this.$message.success('修改成功,请重新登录')
                this.$router.push('/user/login')
              })
            })
            .catch(e => {
              console.log('err', e)
            })
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
