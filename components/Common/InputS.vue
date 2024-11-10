<template>
  <div class="relative">
    <UInput
        :id="id"
        v-model="inputValue"
        @keydown="handleKeyDown"
        :placeholder="placeholder"
        :type="type"
        :autocomplete="autocomplete"
        v-bind="$attrs"
        :ui="{ icon: { trailing: { pointer: '' } } }"
        class="input-wrapper"
    >
    <template v-if="inputValue" #trailing>
      <UButton
          color="gray"
          variant="link"
          :padded="false"
          @click="onClear"
          class="clear-button"
          tabindex="-1"
      >
        <IconsClose/>
      </UButton>
    </template>
    </UInput>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      required: true,
    },
    modelValue: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'text',
    },
    autocomplete: {
      type: String,
      default: 'off',
    },
    onClear: {
      type: Function,
      default: () => {},
    },
    onEnter: {
      type: Function,
      default: () => {},
    },
  },
  emits: ['update:modelValue'],
  data() {
    return {
      inputValue: this.modelValue,  // Initialize inputValue
      lastEnterPress: 0,
    };
  },
  watch: {
    modelValue(newVal) {
      this.inputValue = newVal;
    },
    inputValue(newVal) {
      this.$emit('update:modelValue', newVal);
    },
  },
  methods: {
    handleKeyDown(event) {
      if (event.key === 'Enter') {
        const now = Date.now();
        if (now - this.lastEnterPress > 300) { // Debounce for 300ms
          this.onEnter();
          this.lastEnterPress = now;
        }
      }
    },
    onClear() {
      this.inputValue = '';  // Clear input field
      this.onClear();
    },
  },
};
</script>

<style scoped>
.input-wrapper :deep(input) {
  height: 100%;
}

.clear-button {
  height: 100%;
  display: flex;
  align-items: center;
}
</style>
