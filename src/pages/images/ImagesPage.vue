<script setup lang="ts">
import { ref } from 'vue'
import ImageTable from './widgets/ImageTable.vue'
import EditImageForm from './widgets/EditImageForm.vue'
import { Image } from './types'
import { useItems } from './composables/useImages'
import { useModal, useToast } from 'vuestic-ui'

const doShowEditImageModal = ref(false)

const { items, isLoading, filters, sorting, pagination, ...itemsApi } = useItems()

const itemToEdit = ref<Image | null>(null)

const showEditImageModal = (item: Image) => {
  itemToEdit.value = item
  doShowEditImageModal.value = true
}

const showAddImageModal = () => {
  itemToEdit.value = null
  doShowEditImageModal.value = true
}

const { init: notify } = useToast()

const onImageSaved = async (item: Image) => {
  if (itemToEdit.value) {
    await itemsApi.update(item)
    notify({
      message: `${item.name} has been updated`,
      color: 'success',
    })
  } else {
    itemsApi.add(item)
    notify({
      message: `${item.name} has been created`,
      color: 'success',
    })
  }
}

const onImageDelete = async (item: Image) => {
  await itemsApi.remove(item)
  notify({
    message: `${item.name} has been deleted`,
    color: 'success',
  })
}

const editFormRef = ref()

const { confirm } = useModal()

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
  <h1 class="page-title">Images</h1>

  <VaCard>
    <VaCardContent>
      <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
        <div class="flex flex-col md:flex-row gap-2 justify-start">
          <VaInput v-model="filters.search" placeholder="Search">
            <template #prependInner>
              <VaIcon name="search" color="secondary" size="small" />
            </template>
          </VaInput>
        </div>
        <VaButton @click="showAddImageModal">Add Image</VaButton>
      </div>

      <ImageTable
        v-model:sort-by="sorting.sortBy"
        v-model:sorting-order="sorting.sortingOrder"
        :items="items"
        :loading="isLoading"
        :pagination="pagination"
        @edit="showEditImageModal"
        @delete="onImageDelete"
      />
    </VaCardContent>
  </VaCard>

  <VaModal
    v-slot="{ cancel, ok }"
    v-model="doShowEditImageModal"
    size="small"
    mobile-fullscreen
    close-button
    hide-default-actions
    :before-cancel="beforeEditFormModalClose"
  >
    <h1 class="va-h5">{{ itemToEdit ? 'Edit item' : 'Add item' }}</h1>
    <EditImageForm
      ref="editFormRef"
      :item="itemToEdit"
      :save-button-label="itemToEdit ? 'Save' : 'Add'"
      @close="cancel"
      @save="
        (item) => {
          onImageSaved(item)
          ok()
        }
      "
    />
  </VaModal>
</template>
