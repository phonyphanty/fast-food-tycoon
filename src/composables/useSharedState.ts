import { reactive } from 'vue';
/* Composable imports */
import { useMenu } from '@/composables/useMenu';

const { Menu } = useMenu();

const mainMenu = reactive(new Menu());

export function useSharedState() {
    return {
        mainMenu,
    };
}