<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { EmptyJob, Job } from '../types'
import { SelectOption } from 'vuestic-ui'

const props = defineProps<{
  item: Job | null
  saveButtonLabel: string
}>()

defineEmits<{
  (event: 'save', item: Job): void
  (event: 'close'): void
}>()

const defaultNewItem: EmptyJob = {
  company: 'Company',
  title: 'Title',
  date: 'Date',
  description: 'Description',
}

const newItem = ref({ ...defaultNewItem })

const isFormHasUnsavedChanges = computed(() => {
  return Object.keys(newItem.value).some((key) => {
    if (key === 'team') {
      return false
    }

    return newItem.value[key as keyof EmptyJob] !== (props.item ?? defaultNewItem)?.[key as keyof EmptyJob]
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
    <VaInput v-model="newItem.company" label="Company Name" :rules="[required]" />
    <VaInput v-model="newItem.title" label="Job title" :rules="[required]" />
    <VaInput v-model="newItem.date" label="Date between" :rules="[required]" />
    <VaInput v-model="newItem.description" label="Description" :rules="[required]" />
    <div class="flex justify-end flex-col-reverse sm:flex-row mt-4 gap-2">
      <VaButton preset="secondary" color="secondary" @click="$emit('close')">Cancel</VaButton>
      <VaButton @click="validate() && $emit('save', newItem as Job)">{{ saveButtonLabel }}</VaButton>
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
