/**
 * Main composable for global singletons
 * @module
 */

// Composables
import { useMenu } from '@/composables/useMenu';
import { useMoney } from '@/composables/useMoney';
import { useReputation } from '@/composables/useReputation';
import { useAwareness } from '@/composables/useAwareness';
// Other imports
import { reactive } from 'vue';

const { Menu } = useMenu();
const { Money } = useMoney();
const { Reputation } = useReputation();
const { Awareness } = useAwareness();

type Money = InstanceType<typeof Money>;

const mainMenu = reactive(new Menu());

const initialMoney = 1000;
const money = reactive(new Money(initialMoney)) as Money;

const initialReputation = 300000;
const reputation = reactive(new Reputation(initialReputation));

const initialAwareness = 100000;
const awareness = reactive(new Awareness(initialAwareness));

export function useSharedState() {
    return {
        mainMenu,
        money,
        reputation,
        awareness,
    };
};