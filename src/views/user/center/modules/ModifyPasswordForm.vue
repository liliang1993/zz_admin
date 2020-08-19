<template>
  <a-modal
    title="密码修改"
    :width="640"
    :visible="visible"
    :confirmLoading="loading"
    @ok="
      () => {
        $emit('ok')
      }
    "
    @cancel="
      () => {
        $emit('cancel')
      }
    "
  >
    <a-spin :spinning="loading">
      <a-form :form="form" v-bind="formLayout">
        <!-- 检查是否有 id 并且大于0，大于0是修改。其他是新增，新增不显示主键ID -->
        <!-- <a-form-item v-show="model && model.id > 0" label="主键ID">
          <a-input v-decorator="['id', { initialValue: 0 }]" disabled />
        </a-form-item> -->
        <a-form-item label="用户名">
          <a-input v-decorator="['username', {rules: [{required: true, min: 5, message: '请输入用户名'}]}]" />
        </a-form-item>
        <a-form-item label="旧密码">
          <a-input-password
            placeholder="请输入旧密码"
            v-decorator="[
              'old_password',
              {
                rules: [
                  { required: true, message: '至少6位密码，区分大小写' },
                ],
                validateTrigger: ['change', 'blur']
              }
            ]"
          ></a-input-password>
        </a-form-item>
        <a-form-item label="新密码">
          <a-input-password
            placeholder="至少6位密码，区分大小写"
            v-decorator="[
              'new_password',
              {
                rules: [
                  { required: true, message: '至少6位密码，区分大小写' },
                ],
                validateTrigger: ['change', 'blur']
              }
            ]"
          ></a-input-password>
        </a-form-item>
        <a-form-item label="确认新密码">
          <a-input-password
            placeholder="至少6位密码，区分大小写"
            v-decorator="[
              'new_cp_password',
              {
                rules: [
                  { required: true, message: '至少6位密码，区分大小写' },
                ],
                validateTrigger: ['change', 'blur']
              }
            ]"
          ></a-input-password>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'

// 表单字段
const fields = ['username', 'old_password', 'new_password', 'new_cp_password']

export default {
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    loading: {
      type: Boolean,
      default: () => false
    },
    model: {
      type: Object,
      default: () => null
    }
  },
  data() {
    this.formLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      }
    }
    return {
      form: this.$form.createForm(this)
    }
  },
  created() {
    console.log('custom modal created')

    // 防止表单未注册
    fields.forEach(v => this.form.getFieldDecorator(v))

    // 当 model 发生改变时，为表单设置值
    this.$watch('model', () => {
      this.model && this.form.setFieldsValue(pick(this.model, fields))
    })
  }
}
</script>
