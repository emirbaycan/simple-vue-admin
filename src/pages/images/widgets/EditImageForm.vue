<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Image, EmptyImage } from '../types'
import ImageAvatar from './ImageAvatar.vue'
import { validators } from '../../../services/utils'

const props = defineProps<{
  item: Image | null
  saveButtonLabel: string
}>()

const defaultNewItem: EmptyImage = {
  id: -1,
  name: '',
}

const newItem = ref({ ...defaultNewItem })

const isFormHasUnsavedChanges = computed(() => {
  return Object.keys(newItem.value).some((key) => {
    return newItem.value[key as keyof EmptyImage] !== (props.item ?? defaultNewItem)?.[key as keyof EmptyImage]
  })
})

defineExpose({
  isFormHasUnsavedChanges,
})

watch(
  () => props.item,
  () => {
    if (!props.item) {
      return
    }

    newItem.value = {
      ...props.item,
    }
  },
  { immediate: true },
)

const image = ref<File>()

watch(image, async (newImage) => {
  if (!newImage) {
    return
  }

  const formData = new FormData()

  formData.append('file', newImage)

  const response = await fetch(import.meta.env.VITE_API_URL + 'images', {
    method: 'POST',
    body: formData,
  })

  const result = await response.json()
  const image: any = result.data.item.name

  newItem.value.name = image
})

defineEmits<{
  (event: 'save', item: Image): void
  (event: 'close'): void
}>()
</script>

<template>
  <VaForm v-slot="{ validate }" ref="add-item-form" class="flex-col justify-start items-start gap-4 inline-flex w-full">
    <VaFileUpload
      v-model="image"
      type="single"
      hide-file-list
      class="self-stretch justify-start items-center gap-4 inline-flex"
    >
      <ImageAvatar :item="newItem" size="large" />
      <VaButton preset="primary" size="small">Add image</VaButton>
      <VaButton
        v-if="image"
        preset="primary"
        color="danger"
        size="small"
        icon="delete"
        class="z-10"
        @click.stop="image = undefined"
      />
    </VaFileUpload>
    <div class="self-stretch flex-col justify-start items-start gap-4 flex">
      <div class="flex gap-4 flex-col sm:flex-row w-full">
        <VaInput
          v-model="newItem.name"
          label="Filename"
          class="w-full sm:w-1/2"
          name="name"
          :rules="[validators.required]"
        />
      </div>
      <div class="flex gap-2 flex-col-reverse items-stretch justify-end w-full sm:flex-row sm:items-center">
        <VaButton preset="secondary" color="secondary" @click="$emit('close')">Cancel</VaButton>
        <VaButton @click="validate() && $emit('save', newItem as Image)">{{ saveButtonLabel }}</VaButton>
      </div>
    </div>
  </VaForm>
</template>
