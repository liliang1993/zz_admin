<template>
  <a-modal
    title="预警设置"
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
        <a-form-item label="预警波动率">
          <a-input-number
            style="width: 100%;"
            id="inputNumber"
            v-decorator="['description', { rules: [{ required: true, message: '请输入预警波动率！' }] }]"
          />
          <!-- <a-input v-decorator="['description', {rules: [{required: true, min: 5, message: '请输入至少五个字符的规则描述！'}]}]" /> -->
        </a-form-item>
        <!-- <a-form-item label="预警邮箱">
          <a-input
            v-decorator="[
              'email',
              { rules: [{ required: true, type: 'email', message: '请输入预警邮箱' }], validateTrigger: ['blur'] }
            ]"
          />
        </a-form-item> -->
        <a-form-item label="是否开启预警">
          <a-switch checked-children="开" un-checked-children="关" default-checked />
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
