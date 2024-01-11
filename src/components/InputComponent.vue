<script setup>
import { ref, watch } from 'vue'
const emits = defineEmits(['update:inputField'])
const props = defineProps({
  disable: Boolean,
  inputField: [String, Number],
  type: {
    type: String,
    default: 'text'
  },
  error: [Array, Boolean],
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  }
})
const inputText = ref(props.inputField)

const setValue = () => {
  emits('update:inputField', inputText.value)
}

const isNumber = (event) => {
  if (props.type === 'number') {
    let RE = /[0-9]/
    if (!RE.test(event.key)) {
      return event.preventDefault()
    }
  }
}
</script>
<template>
  <div class="input-content">
    <label for="label" class="label-content">
      {{ label }}
    </label>
    <input
      v-model="inputText"
      :disabled="disable"
      class="input-field text-base font-bold base-color"
      :placeholder="placeholder"
      @input="setValue"
      @keypress="isNumber"
    />
  </div>
</template>

<style scoped>
.label-content {
  font-size: 16px;
}

.input-content {
  display: flex;
  align-items: center;
  gap: 8px;
  text-align: left;
  width: 100%;
}

.input-field {
  width: 100%;
  border: 2px solid #181818;
  border-radius: 8px;
  padding: 8px 12px;
}
</style>