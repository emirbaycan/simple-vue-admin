<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { EmptyTestimonial, Testimonial } from '../types'
import { SelectOption } from 'vuestic-ui'

const props = defineProps<{
  item: Testimonial | null
  saveButtonLabel: string
}>()

defineEmits<{
  (event: 'save', item: Testimonial): void
  (event: 'close'): void
}>()

const defaultNewItem: EmptyTestimonial = {
  name: 'Name',
  comment: 'Comment',
  position: 'Position',
  company: 'Company',
  img: 'Image',
}

const newItem = ref({ ...defaultNewItem })

const isFormHasUnsavedChanges = computed(() => {
  return Object.keys(newItem.value).some((key) => {
    if (key === 'team') {
      return false
    }

    return (
      newItem.value[key as keyof EmptyTestimonial] !== (props.item ?? defaultNewItem)?.[key as keyof EmptyTestimonial]
    )
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

const required = (v: string | SelectOption) => !!v || 'This field is required'
</script>

<template>
  <VaForm v-slot="{ validate }" class="flex flex-col gap-2">
    <VaInput v-model="newItem.name" label="Name" :rules="[required]" />
    <VaInput v-model="newItem.comment" label="Comment" :rules="[required]" />
    <VaInput v-model="newItem.position" label="Position" :rules="[required]" />
    <VaInput v-model="newItem.company" label="Company" :rules="[required]" />
    <div class="flex justify-end flex-col-reverse sm:flex-row mt-4 gap-2">
      <VaButton preset="secondary" color="secondary" @click="$emit('close')">Cancel</VaButton>
      <VaButton @click="validate() && $emit('save', newItem as Testimonial)">{{ saveButtonLabel }}</VaButton>
    </div>
  </VaForm>
</template>

<style lang="scss" scoped>
.va-select-content__autocomplete {
  flex: 1;
}

.va-input-wrapper__text {
  gap: 0.2rem;
}
</style>
