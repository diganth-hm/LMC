import { create } from 'zustand';
import { CreditBatch, Order } from '../types';

interface BuyerPurchaseState {
  selectedBatch: CreditBatch | null;
  quantityTonnes: number;
  paymentMethod: string;
  agreedToTerms: boolean;
  completedOrder: Order | null;
  setSelectedBatch: (batch: CreditBatch | null) => void;
  setQuantityTonnes: (quantity: number) => void;
  setPaymentMethod: (method: string) => void;
  setAgreedToTerms: (agreed: boolean) => void;
  setCompletedOrder: (order: Order | null) => void;
  resetPurchaseFlow: () => void;
}

export const useBuyerPurchaseStore = create<BuyerPurchaseState>((set) => ({
  selectedBatch: null,
  quantityTonnes: 10,
  paymentMethod: 'Corporate Wire / RTGS',
  agreedToTerms: false,
  completedOrder: null,
  setSelectedBatch: (selectedBatch) => set({ selectedBatch }),
  setQuantityTonnes: (quantityTonnes) => set({ quantityTonnes }),
  setPaymentMethod: (paymentMethod) => set({ paymentMethod }),
  setAgreedToTerms: (agreedToTerms) => set({ agreedToTerms }),
  setCompletedOrder: (completedOrder) => set({ completedOrder }),
  resetPurchaseFlow: () =>
    set({
      selectedBatch: null,
      quantityTonnes: 10,
      paymentMethod: 'Corporate Wire / RTGS',
      agreedToTerms: false,
      completedOrder: null,
    }),
}));
