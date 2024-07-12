<template>
  <div>
    <div ref="container1" class="container">
      Container 1
    </div>

    <div ref="container2" class="container">
      Container 2
    </div>

    <div ref="item" class="item" :style="itemStyle">
      Animated Item
    </div>

    <button @click="moveItem">Move Item</button>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

const container1 = ref(null)
const container2 = ref(null)
const item = ref(null)
const isInContainer1 = ref(true)

const itemStyle = reactive({
  position: 'absolute',
  transition: 'all 0.5s ease',
  top: '0px',
  left: '0px'
})

const updateItemPosition = () => {
  const containerRect = (isInContainer1.value ? container1.value : container2.value).getBoundingClientRect()
  const itemRect = item.value.getBoundingClientRect()

  itemStyle.top = `${containerRect.top - itemRect.height / 2 + containerRect.height / 2}px`
  itemStyle.left = `${containerRect.left + containerRect.width / 2 - itemRect.width / 2}px`
}

onMounted(() => {
  updateItemPosition()
  window.addEventListener('resize', updateItemPosition)
})

const moveItem = () => {
  isInContainer1.value = !isInContainer1.value
  updateItemPosition()
}
</script>

<style scoped>
.container {
  border: 1px solid #ccc;
  padding: 20px;
  margin: 10px;
  height: 100px;
  position: relative;
}

.item {
  background-color: #3498db;
  color: white;
  padding: 10px;
  display: inline-block;
  z-index: 10;
}
</style>
