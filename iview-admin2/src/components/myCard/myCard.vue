<template>
  <div :class="classes">
    <div :class="headClasses"
         v-if="showHead">
      <slot name="title">
        <p v-if="title">
          <Icon v-if="icon"
                :type="icon"></Icon>
          <span>{{title}}</span>
        </p>
      </slot>
    </div>
    <div :class="extraClasses"
         v-if="showExtra">
      <slot name="extra"></slot>
    </div>
    <div :class="bodyClasses"
         :style="bodyStyles"
         @click="handleClickLink">
      <slot></slot>
    </div>
  </div>
</template>
<script>
import Icon from '../icon/icon.vue'
const prefixCls = 'ivu-card'
const defaultPadding = 16

export default {
  name: 'myCard',
  components: { Icon },
  props: {
    bordered: {
      type: Boolean,
      default: true
    },
    disHover: {
      type: Boolean,
      default: false
    },
    shadow: {
      type: Boolean,
      default: false
    },
    padding: {
      type: Number,
      default: defaultPadding
    },
    title: {
      type: String
    },
    icon: {
      type: String
    }
  },
  data () {
    return {
      showHead: true,
      showExtra: true
    }
  },
  computed: {
    classes () {
      return [
        `${prefixCls}`,
        {
          [`${prefixCls}-bordered`]: this.bordered && !this.shadow,
          [`${prefixCls}-dis-hover`]: this.disHover || this.shadow,
          [`${prefixCls}-shadow`]: this.shadow
        }
      ]
    },
    headClasses () {
      return `${prefixCls}-head`
    },
    extraClasses () {
      return `${prefixCls}-extra`
    },
    bodyClasses () {
      return `${prefixCls}-body`
    },
    bodyStyles () {
      if (this.padding !== defaultPadding) {
        return {
          padding: `${this.padding}px`
        }
      } else {
        return ''
      }
    }
  },
  methods: {
    // Ctrl or CMD and click, open in new window when use `to`
    handleClickLink (event) {
      this.$emit('click', event)
      const openInNewWindow = event.ctrlKey || event.metaKey

      this.handleCheckClick(event, openInNewWindow)
    }
  },
  mounted () {
    this.showHead = this.title || this.$slots.title !== undefined
    this.showExtra = this.$slots.extra !== undefined
  }
}
</script>
