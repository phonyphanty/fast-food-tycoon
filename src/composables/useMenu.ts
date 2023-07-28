// Composables
import { useAbstractFood } from '@/composables/useAbstractFood';
import { useStandardCustomerType } from '@/composables/useStandardCustomerType';
import { useSharedStockState } from '@/composables/useSharedStockState';
import { useStock } from '@/composables/useStock';
import { useAbstractMenu } from '@/composables/useAbstractMenu';
import { useBurger } from '@/composables/useBurger';
import { useBurgerStack } from '@/composables/useBurgerStack';
import { useTime } from './useTime';
// Other
import { reactive, ref, type Ref } from 'vue';

let { Product } = useAbstractFood();
let { standardCustomerType } = useStandardCustomerType();
let { pairedStockPlan } = useSharedStockState();
let { ElementQuantity } = useStock();
let { AbstractMenu } = useAbstractMenu();
const { BurgerStack } = useBurgerStack();
const { burgerIngredientsMap } = useBurger();
const { time } = useTime();

type Product = InstanceType<typeof Product>;

class Menu extends AbstractMenu {
    private products: Product[] = [];

    constructor() {
        super();
    }

    public get(): Product[] {
        return this.products;
    }

    public add(product: Product): void {
        this.products.push(product);
        pairedStockPlan.addProduct(new ElementQuantity<Product>(product));
        standardCustomerType.findBestPurchases(this, time);
    }
    
    public delete(product: Product): boolean {
        let ix = -1;
        ix = this.products.findIndex(value => value.id === product.id)
        if (ix !== -1) {
            this.products = this.products.slice(0, ix).concat(this.products.slice(ix + 1));
            pairedStockPlan.removeProduct(product);
            standardCustomerType.findBestPurchases(this, time);
            return true;
        } else {
            return false;
        }
    }

    public length(): number {
        return this.products.length;
    }
};

type MenuType = InstanceType<typeof Menu>;

const mainMenu = reactive(new Menu());

// Debug cheeseburger
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

export function useMenu() {    
    return {
        mainMenu
    };
}