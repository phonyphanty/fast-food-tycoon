/**
 * Main composable for global singletons
 * @module
 */

// Composables
import { useMoney } from '@/composables/useMoney';
import { useReputation } from '@/composables/useReputation';
import { useAwareness } from '@/composables/useAwareness';
import { useAbstractFood } from '@/composables/useAbstractFood';
import { useBurgerStack } from '@/composables/useBurgerStack';
import { useBurger } from '@/composables/useBurger';
// Other imports
import { reactive } from 'vue';

const { Money } = useMoney();
const { Reputation } = useReputation();
const { Awareness } = useAwareness();
const { Product } = useAbstractFood();
const { BurgerStack } = useBurgerStack();
const { burgerIngredientsMap } = useBurger();

type Money = InstanceType<typeof Money>;
type Product = InstanceType<typeof Product>;

const initialMoney = 1_000;
const money = reactive(new Money(initialMoney)) as Money;

const initialReputation = 100_000;
const reputation = reactive(new Reputation(initialReputation));

const initialAwareness = 100_000;
const awareness = reactive(new Awareness(initialAwareness));

export function useSharedState() {
    return {
        money,
        reputation,
        awareness,
    };
};