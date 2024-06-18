<template>
  <div class="relative">
    <UInput
        :id="id"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :placeholder="placeholder"
        :type="type"
        :autocomplete="autocomplete"
        v-bind="$attrs"
        :ui="{ icon: { trailing: { pointer: '' } } }"
    >
      <template v-if="modelValue" #trailing>
        <UButton
            color="gray"
            variant="link"

            :padded="false"
            @click="onClear"
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
      default: null,
    },
  },
  emits: ['update:modelValue'],

};
</script>
