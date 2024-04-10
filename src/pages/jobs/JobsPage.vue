<script setup lang="ts">
import { ref } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import { useItems } from './composables/useJobs'
import JobCards from './widgets/JobsCards.vue'
import JobTable from './widgets/JobsTable.vue'
import EditJobForm from './widgets/EditJobForm.vue'
import { Job } from './types'
import { useModal, useToast } from 'vuestic-ui'

const doShowAsCards = useLocalStorage('items-view', true)

const { items, update, add, isLoading, remove, pagination, sorting } = useItems()

const itemToEdit = ref<Job | null>(null)
const doShowItemFormModal = ref(false)

const editItem = (item: Job) => {
  itemToEdit.value = item
  doShowItemFormModal.value = true
}

const createNewItem = () => {
  itemToEdit.value = null
  doShowItemFormModal.value = true
}

const { init: notify } = useToast()

const onItemSaved = async (item: Job) => {
  doShowItemFormModal.value = false
  if ('id' in item) {
    await update(item as Job)
    notify({
      message: 'Item updated',
      color: 'success',
    })
  } else {
    await add(item as Job)
    notify({
      message: 'Item created',
      color: 'success',
    })
  }
}

const { confirm } = useModal()

const onItemDeleted = async (item: Job) => {
  const response = await confirm({
    title: 'Delete item',
    message: `Are you sure you want to delete item "${item.title}"?`,
    okText: 'Delete',
    size: 'small',
    maxWidth: '380px',
  })

  if (!response) {
    return
  }

  await remove(item)
  notify({
    message: 'Item deleted',
    color: 'success',
  })
}

const editFormRef = ref()

const beforeEditFormModalClose = async (hide: () => unknown) => {
  if (editFormRef.value.isFormHasUnsavedChanges) {
    const agreed = await confirm({
      maxWidth: '380px',
      message: 'Form has unsaved changes. Are you sure you want to close it?',
      size: 'small',
    })
    if (agreed) {
      hide()
    }
  } else {
    hide()
  }
}
</script>

<template>
  <h1 class="page-title">Jobs</h1>

  <VaCard>
    <VaCardContent>
      <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
        <div class="flex flex-col md:flex-row gap-2 justify-start">
          <VaButtonToggle
            v-model="doShowAsCards"
            color="background-element"
            border-color="background-element"
            :options="[
              { label: 'Cards', value: true },
              { label: 'Table', value: false },
            ]"
          />
        </div>
        <VaButton icon="add" @click="createNewItem">Job</VaButton>
      </div>

      <JobCards v-if="doShowAsCards" :items="items" :loading="isLoading" @edit="editItem" @delete="onItemDeleted" />
      <JobTable
        v-else
        v-model:sort-by="sorting.sortBy"
        v-model:sorting-order="sorting.sortingOrder"
        v-model:pagination="pagination"
        :items="items"
        :loading="isLoading"
        @edit="editItem"
        @delete="onItemDeleted"
      />
    </VaCardContent>

    <VaModal
      v-slot="{ cancel, ok }"
      v-model="doShowItemFormModal"
      size="small"
      mobile-fullscreen
      close-button
      stateful
      hide-default-actions
      :before-cancel="beforeEditFormModalClose"
    >
      <h1 v-if="itemToEdit === null" class="va-h5 mb-4">Add item</h1>
      <h1 v-else class="va-h5 mb-4">Edit item</h1>
      <EditJobForm
        ref="editFormRef"
        :item="itemToEdit"
        :save-button-label="itemToEdit === null ? 'Add' : 'Save'"
        @close="cancel"
        @save="
          (item) => {
            onItemSaved(item)
            ok()
          }
        "
      />
    </VaModal>
  </VaCard>
</template>
