<template>
  <a-modal
    title="新建账户"
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
        <a-form-item label="交易所名称">
          <!-- <a-input v-decorator="['description', {rules: [{required: true, min: 5, message: '请输入至少五个字符的规则描述！'}]}]" /> -->
          <a-select
            v-decorator="['exchange', { rules: [{ required: true, message: '请选择交易所！' }] }]"
            placeholder="请选择"
            default-value="0"
          >
            <a-select-option value="0">火币</a-select-option>
            <a-select-option value="1">OKEX</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="秘钥">
          <a-input v-decorator="['secret_key', { rules: [{ required: true, message: '请输入秘钥！' }] }]" />
        </a-form-item>
        <a-form-item label="账户别名">
          <a-input v-decorator="['account_name', { rules: [{ required: true, message: '请输入账户别名！' }] }]" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'

// 表单字段
const fields = ['exchange', 'secret_key', 'account_name']

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
    fields.forEach((v) => this.form.getFieldDecorator(v))

    // 当 model 发生改变时，为表单设置值
    this.$watch('model', () => {
      this.model && this.form.setFieldsValue(pick(this.model, fields))
    })
  }
}
</script>
