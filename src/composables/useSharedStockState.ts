/**
 * Global singletons related to stock planning and stock piling
 * @module
 */

// Composables
import { useStock } from '@/composables/useStock';
// Other
import { reactive, unref } from 'vue';

const { StockPlan, PairedStockPlan, Stock } = useStock();

type StockPlan = InstanceType<typeof StockPlan>;

const savedStockPlan = reactive(new StockPlan());
const tempStockPlan = reactive(new StockPlan());
const pairedStockPlan = reactive(new PairedStockPlan(savedStockPlan as StockPlan, tempStockPlan as StockPlan));

const stock = reactive(new Stock(savedStockPlan as StockPlan));

export function useSharedStockState() {
    return {
        savedStockPlan,
        stock,
        tempStockPlan,
        pairedStockPlan,
    }
}