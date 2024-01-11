<script setup>
import { ref } from 'vue'
const emits = defineEmits(['update:inputField'])
const props = defineProps({
  max: Number,
  area: {
    type: Boolean,
    default: false
  },
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
  info: {
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
    <div class="label-container" v-if="info">
      <label for="label" class="text-md">
        {{ label }}
      </label>
      <label for="info" class="label-content--info text-md">
        {{ info }}
      </label>
    </div>
    <label for="label" class="text-md" v-else>
      {{ label }}
    </label>
    <input
      :maxlength="max"
      v-model="inputText"
      :disabled="disable"
      :class="{ 'text-area': area }"
      class="input-field font-bold base-color"
      :placeholder="placeholder"
      @input="setValue"
      @keypress="isNumber"
    />
  </div>
</template>

<style scoped>
.label-container {
  display: flex;
  justify-content: space-between;
}
.label-content--info {
  color: #fd0a0a;
}

.text-area {
  height: 60px;
}

.input-content {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
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