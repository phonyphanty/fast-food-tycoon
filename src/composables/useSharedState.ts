/**
 * Main composable for global singletons
 * @module
 */

// Composables
import { useMenu } from '@/composables/useMenu';
import { useMoney } from '@/composables/useMoney';
// Other imports
import { reactive } from 'vue';

const { Menu } = useMenu();
const { Money } = useMoney();

type Money = InstanceType<typeof Money>;

const mainMenu = reactive(new Menu());
const initialMoney = 1000;
const money = reactive(new Money(initialMoney)) as Money;

export function useSharedState() {
    return {
        mainMenu,
        money,
    };
};