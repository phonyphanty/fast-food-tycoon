import { useAbstractFood } from '@/composables/useAbstractFood';
import { reactive, ref, type Ref } from 'vue';

export function useMenu() {
    let { Product } = useAbstractFood();

    type Product = InstanceType<typeof Product>;

    class Menu {
        private products: Product[] = [];

        constructor() {
            
        }

        public get(): Product[] {
            return this.products;
        }

        public add(product: Product): void {
            this.products.push(product);
        }

        public delete(product: Product): boolean {
            let ix = -1;
            ix = this.products.findIndex(value => value.id === product.id)
            if (ix !== -1) {
                this.products = this.products.slice(0, ix).concat(this.products.slice(ix + 1));
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

    return {
        Menu,
        mainMenu,
    };
}