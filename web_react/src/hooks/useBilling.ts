import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import BillingService, { Billing } from "../services/BillingService";

export function useBilling() {
    const queryClient = useQueryClient();

    const { data: billings, isLoading } = useQuery({
        queryKey: ['billing'],
        queryFn: BillingService.getUserBilling
    });

    const addBilling = useMutation({
        mutationFn: BillingService.addBilling,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['billing'] });
        }
    });

    const updateBilling = useMutation({
        mutationFn: ({ id, billingData }: { id: number; billingData: Billing }) => BillingService.updateBilling(id, billingData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['billing'] });
        }
    });

    const deleteBilling = useMutation({
        mutationFn: (id: number) => BillingService.deleteBilling(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['billing'] });
        }
    });

    return { billings, isLoading, addBilling, updateBilling, deleteBilling };
}
