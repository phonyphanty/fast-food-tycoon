/**
 * Main composable for global singletons
 * @module
 */

// Composables
import { useMenu } from '@/composables/useMenu';
import { useMoney } from '@/composables/useMoney';
import { useReputation } from '@/composables/useReputation';
import { useAwareness } from '@/composables/useAwareness';
import { useAbstractFood } from '@/composables/useAbstractFood';
import { useBurgerStack } from '@/composables/useBurgerStack';
import { useBurger } from '@/composables/useBurger';
// Other imports
import { reactive } from 'vue';

const { Menu } = useMenu();
const { Money } = useMoney();
const { Reputation } = useReputation();
const { Awareness } = useAwareness();
const { Product } = useAbstractFood();
const { BurgerStack } = useBurgerStack();
const { burgerIngredientsMap } = useBurger();

type Money = InstanceType<typeof Money>;
type Product = InstanceType<typeof Product>;

const mainMenu = reactive(new Menu());

const cheeseburger = new BurgerStack(
    burgerIngredientsMap.get('cheap-bun')!,
    burgerIngredientsMap.get('cheap-cheese')!,
    burgerIngredientsMap.get('cheap-patty')!,
    burgerIngredientsMap.get('cheap-bun')!,
);
cheeseburger.name = 'Cheeseburger';
cheeseburger.price = 8;
cheeseburger.evaluate();
cheeseburger.generateIcon();

mainMenu.add(cheeseburger);

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