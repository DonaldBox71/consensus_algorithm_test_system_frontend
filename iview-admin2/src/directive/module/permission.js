import store from '@/store'
import { hasOneOf } from '@/libs/tools'
export default {
  inserted: (el, binding, vnode) => {
    const value = binding.value
    const access = store.state.user.access
    if (!(hasOneOf(value, access))) {
      el.remove()
    }
  }
}
