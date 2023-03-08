<script setup lang="ts">
// Composables
import { useModal } from '@/composables/useModal';
import { ref } from 'vue';

const { Modal } = useModal();

type Modal = InstanceType<typeof Modal>;

const props = defineProps<{
    modal: Modal,
}>();

const dialog = ref<HTMLDialogElement | null>();

const showModal = function() {
    dialog.value?.showModal();
}

const action = function(actionType: 'accept' | 'reject') {
    props.modal[actionType]();
    dialog.value?.close();
}

defineExpose({
    showModal,
});

</script>

<template>
<dialog ref="dialog" class="">
    <h2 class="font-bold mb-2">{{ modal.title }}</h2>
    <p class="mb-4">{{ modal.description }}</p>
    <div class="flex justify-center gap-x-4">
        <button @click="action('reject')" class="hover:underline underline-offset-2">Cancel</button>
        <button @click="action('accept')" class="hover:underline underline-offset-2">Confirm</button>
    </div>
</dialog>
</template>