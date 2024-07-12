<template>
  <div class="container-wrapper">
    <div v-for="(container, index) in containers" :key="index" class="container" >
      <TransitionGroup
          :name="transitionName"
          tag="div"
          @before-leave="beforeLeave"
          @leave="leave"
          @enter="enter"
          v-auto-animate
      >
        <div
            v-for="item in container"
            :key="item.id"
            :ref="el => { if (el) itemRefs[item.id] = el }"
            class="item"
            @click="moveItem(item, index)"
        >
          {{ item.content }}
        </div>
      </TransitionGroup>
    </div>
    <div ref="centerStage" class="center-stage"></div>
    <div v-if="movingItemData"
         :style="movingItemStyle"
         class="item"
    >
      {{ movingItemData.item.content }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onBeforeUpdate } from 'vue'
const {$gsap} = useNuxtApp();


const containers = ref([
  [
    { id: 1, content: 'Item 1' },
    { id: 2, content: 'Item 2' },
    { id: 3, content: 'Item 3' },
  ],
  [
    { id: 4, content: 'Item 4' },
    { id: 5, content: 'Item 5' },
  ]
])

const centerStage = ref(null)
const movingItemData = ref(null)
const itemRefs = ref({})
const movingItemId = ref(null)

const transitionName = computed(() => movingItemId.value ? '' : 'item')

const movingItemStyle = computed(() => {
  if (!movingItemData.value) return {}
  return {
    position: 'fixed',
    left: `${movingItemData.value.currentPos.x}px`,
    top: `${movingItemData.value.currentPos.y}px`,
    background: '#f0f0f0',
    padding: '10px',
    zIndex: 1000,
  }
})

onBeforeUpdate(() => {
  itemRefs.value = {}
})

const moveItem = async (item, fromIndex) => {
  const toIndex = fromIndex === 0 ? 1 : 0

  const itemEl = itemRefs.value[item.id]
  if (!itemEl) {
    console.error('Item element not found')
    return
  }

  movingItemId.value = item.id;

  const startRect = itemEl.getBoundingClientRect();
  const centerRect = centerStage.value.getBoundingClientRect(); // mid destination

  movingItemData.value = {
    item,
    startPos: { x: startRect.left, y: startRect.top },
    endPos: null,
    currentPos: { x: startRect.left, y: startRect.top }
  }

  // Remove item from the source container
  containers.value[fromIndex] = containers.value[fromIndex].filter(i => i.id !== item.id)

  // Add item to the target container
  containers.value[toIndex].unshift(item)

  // Wait for the DOM to update
  await nextTick()

  // Get the new item element and set the end position
  const newItemEl = itemRefs.value[item.id]
  if (newItemEl) {
    const endRect = newItemEl.getBoundingClientRect()
    movingItemData.value.endPos = { x: endRect.left, y: endRect.top }

    // Animate to final position
    await animateTo(movingItemData.value.endPos, 0.5);

    // Clean up
    movingItemData.value = null
    movingItemId.value = null
  } else {
    console.error('New item element not found')
    movingItemData.value = null
    movingItemId.value = null
  }
}

const animateTo = (position, duration, delay = 0) => {
  return new Promise(resolve => {
    $gsap.to(movingItemData.value.currentPos, {
      x: position.x,
      y: position.y,
      duration,
      delay,
      onComplete: resolve
    })
  })
}

const beforeLeave = (el) => {
  if (el.dataset.id === movingItemId.value) {
    el.style.display = 'none'
  }
}

const leave = (el, done) => {
  if (el.dataset.id !== movingItemId.value) {
    $gsap.to(el, {
      opacity: 0,
      scale: 0.8,
      duration: 0,
      onComplete: done
    })
  } else {
    done()
  }
}

const enter = (el, done) => {
  if (el.dataset.id !== movingItemId.value) {
    $gsap.fromTo(el,
        { opacity: 0},
        { opacity: 1, scale: 1, duration: 0.4, delay: 0.4,
          onComplete: done }
    )
  } else {
    el.style.opacity = 0
    done()
  }
}
</script>

<style scoped>
.container-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  position: relative;
}

.container {
  border: 1px solid #ccc;
  padding: 10px;
  min-height: 200px;
}

.item {
  background-color: #f0f0f0;
  margin: 5px;
  padding: 10px;
  width: 100px;
  height: 40px;
  cursor: pointer;
}

.center-stage {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 1px;
  height: 1px;
}

.item-move {
  transition: transform 0.3s ease;
}

.moving-item {
  position: fixed;
  background-color: #f0f0f0;
  padding: 10px;
  z-index: 1000;
}
</style>
