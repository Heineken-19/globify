import api from "./api";
import { Billing } from "../types"


const BillingService = {
    async getUserBilling() {
        return api.get<Billing[]>('/api/billing');
    },
    
    async addBilling(billingData: Billing) {
        return api.post<Billing>('/api/billing', billingData);
    },
    
    async updateBilling(id: number, billingData: Billing) {
        return api.put<Billing>(`/api/billing/${id}`, billingData);
    },
    
    async deleteBilling(id: number) {
        return api.delete(`/api/billing/${id}`);
    }
};

export default BillingService;
export type {Billing};