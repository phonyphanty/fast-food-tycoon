import { useAbstractFood } from '@/composables/useAbstractFood';

const { Product } = useAbstractFood();

type Product = InstanceType<typeof Product>;

export function useAbstractMenu() {
    abstract class AbstractMenu {
        public abstract get(): Product[];
        public abstract add(product: Product): void;
        public abstract delete(product: Product): boolean;
        public abstract length(): number;
    }

    return {
        AbstractMenu,
    }
}