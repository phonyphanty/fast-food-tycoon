/**
 * Global singletons for customer types
 * @module
 */

// Composables
import { useStandardCustomerType } from '@/composables/useStandardCustomerType';
// Other imports
import { reactive } from 'vue';

const { StandardCustomerType } = useStandardCustomerType();

const standardCustomerType = reactive(new StandardCustomerType());

export function useSharedCustomerTypeState() {
    return {
        standardCustomerType,
    };
};