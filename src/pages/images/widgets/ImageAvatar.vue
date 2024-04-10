<script setup lang="ts">
import { PropType } from 'vue'
import { EmptyImage } from '../types'

const avatarColor = (itemName: string) => {
  const colors = ['primary', '#FFD43A', '#ADFF00', '#262824', 'danger']
  const index = itemName.charCodeAt(0) % colors.length
  return colors[index]
}

defineProps({
  item: {
    type: Object as PropType<EmptyImage>,
    required: true,
  },
  size: {
    type: String,
    default: 'medium',
  },
})
</script>

<template>
  <VaAvatar
    :size="size"
    :src="'http://localhost:1998/images/' + item.name"
    :fallback-text="item.name || item.name[0]"
    :color="avatarColor(item.name)"
  />
</template>
