<!-- RecursiveMenu.vue -->
<script setup lang="ts">
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { ref, onMounted, onUnmounted, watch } from 'vue'

interface MenuItemType {
  label: string
  icon?: string
  action?: () => void
  children?: MenuItemType[]
  loading?: boolean
}

const props = defineProps<{
  item: MenuItemType
  isRoot?: boolean
  mode?: 'click' | 'hover'
}>()

const menuRef = ref(null)
const isOpen = ref(false)
const hoverTimeout = ref<number | null>(null)

// Handle hover state
const handleMouseEnter = () => {
  if (props.mode !== 'hover') return

  if (hoverTimeout.value) {
    clearTimeout(hoverTimeout.value)
    hoverTimeout.value = null
  }
  isOpen.value = true
}

const handleMouseLeave = () => {
  if (props.mode !== 'hover') return

  hoverTimeout.value = window.setTimeout(() => {
    isOpen.value = false
  }, 150) // Small delay to prevent menu from closing when moving to submenu
}

// Handle click state
const handleClick = () => {
  if (props.mode === 'click') {
    isOpen.value = !isOpen.value
  }
  props.item.action?.()
}

// Clean up timeouts
onUnmounted(() => {
  if (hoverTimeout.value) {
    clearTimeout(hoverTimeout.value)
  }
})

// Watch for parent menu state changes
const parentMenuOpen = ref(false)
watch(() => parentMenuOpen.value, (newVal) => {
  if (!newVal) {
    isOpen.value = false
  }
})
</script>

<template>
  <Menu
      ref="menuRef"
      as="div"
      class="relative inline-block text-left isolate"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
  >
    <!-- Root level items -->
    <MenuButton
        v-if="isRoot"
        class="flex w-full items-center justify-between rounded-lg px-4 py-2
             hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
        @click="handleClick"
    >
      <span class="flex items-center gap-2">
        <UIcon v-if="item.icon" :name="item.icon" />
        {{ item.label }}
      </span>
      <UIcon
          v-if="item.children"
          name="i-heroicons-chevron-down"
          class="transition-transform duration-200"
          :class="isOpen ? 'rotate-180' : ''"
      />
    </MenuButton>

    <!-- Nested items -->
    <div
        v-else
        class="flex w-full items-center justify-between rounded-lg px-4 py-2
             hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
        @click="handleClick"
    >
      <span class="flex items-center gap-2">
        <UIcon v-if="item.icon" :name="item.icon" />
        {{ item.label }}
      </span>
      <UIcon
          v-if="item.children"
          name="i-heroicons-chevron-right"
          class="transition-transform duration-200"
      />
    </div>

    <transition
        enter-active-class="transition duration-100 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-75 ease-in"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
    >
      <MenuItems
          v-if="isOpen && item.children"
          class="absolute z-[100] mt-2 w-48 origin-top-left rounded-lg bg-white
               dark:bg-gray-900 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          :class="[
          isRoot ? 'left-0' : 'left-full top-0 -mt-2 ml-1'
        ]"
          @mouseenter="handleMouseEnter"
          @mouseleave="handleMouseLeave"
      >
        <div class="p-1">
          <template v-for="child in item.children" :key="child.label">
            <MenuItem v-if="!child.children" v-slot="{ active }">
              <div v-if="child.loading" class="px-4 py-2">
                <UIcon name="i-heroicons-arrow-path" class="animate-spin" />
              </div>
              <button
                  v-else
                  @click="child.action?.()"
                  :class="[
                  active ? 'bg-gray-100 dark:bg-gray-800' : '',
                  'block w-full rounded-lg px-4 py-2 text-left'
                ]"
              >
                <span class="flex items-center gap-2">
                  <UIcon v-if="child.icon" :name="child.icon" />
                  {{ child.label }}
                </span>
              </button>
            </MenuItem>

            <RecursiveMenu
                v-else
                :item="child"
                :is-root="false"
                :mode="mode"
                v-model:parent-menu-open="isOpen"
            />
          </template>
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>
