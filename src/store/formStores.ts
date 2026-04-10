/**
 * 表单状态管理 - 使用 Zustand 管理表单状态
 * 用于复杂表单场景，支持多步骤表单、草稿保存、状态恢复等
 */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ============ Lead Form Store ============

interface LeadFormState {
  // 表单数据
  formData: Record<string, unknown>
  setFormData: (data: Record<string, unknown>) => void
  updateField: (field: string, value: unknown) => void
  clearFormData: () => void
  
  // 表单状态
  isDirty: boolean
  setIsDirty: (dirty: boolean) => void
  
  // 当前步骤（用于多步骤表单）
  currentStep: number
  setCurrentStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void
  
  // 草稿保存
  savedDraft: Record<string, unknown> | null
  saveDraft: () => void
  loadDraft: () => void
  clearDraft: () => void
}

export const useLeadFormStore = create<LeadFormState>()(
  persist(
    (set, get) => ({
      formData: {},
      setFormData: (data) => set({ formData: data, isDirty: true }),
      updateField: (field, value) => set((state) => ({
        formData: { ...state.formData, [field]: value },
        isDirty: true,
      })),
      clearFormData: () => set({ formData: {}, isDirty: false }),
      
      isDirty: false,
      setIsDirty: (dirty) => set({ isDirty: dirty }),
      
      currentStep: 0,
      setCurrentStep: (step) => set({ currentStep: step }),
      nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
      prevStep: () => set((state) => ({ currentStep: Math.max(0, state.currentStep - 1) })),
      
      savedDraft: null,
      saveDraft: () => set({ savedDraft: get().formData }),
      loadDraft: () => set({ formData: get().savedDraft || {}, isDirty: true }),
      clearDraft: () => set({ savedDraft: null }),
    }),
    {
      name: 'lead-form-store',
      partialize: (state) => ({
        savedDraft: state.savedDraft,
      }),
    }
  )
)

// ============ Contact Form Store ============

interface ContactFormState {
  formData: Record<string, unknown>
  setFormData: (data: Record<string, unknown>) => void
  updateField: (field: string, value: unknown) => void
  clearFormData: () => void
  isDirty: boolean
  setIsDirty: (dirty: boolean) => void
  savedDraft: Record<string, unknown> | null
  saveDraft: () => void
  loadDraft: () => void
  clearDraft: () => void
}

export const useContactFormStore = create<ContactFormState>()(
  persist(
    (set, get) => ({
      formData: {},
      setFormData: (data) => set({ formData: data, isDirty: true }),
      updateField: (field, value) => set((state) => ({
        formData: { ...state.formData, [field]: value },
        isDirty: true,
      })),
      clearFormData: () => set({ formData: {}, isDirty: false }),
      isDirty: false,
      setIsDirty: (dirty) => set({ isDirty: dirty }),
      savedDraft: null,
      saveDraft: () => set({ savedDraft: get().formData }),
      loadDraft: () => set({ formData: get().savedDraft || {}, isDirty: true }),
      clearDraft: () => set({ savedDraft: null }),
    }),
    {
      name: 'contact-form-store',
      partialize: (state) => ({
        savedDraft: state.savedDraft,
      }),
    }
  )
)

// ============ Order Form Store ============

interface OrderFormState {
  formData: Record<string, unknown>
  setFormData: (data: Record<string, unknown>) => void
  updateField: (field: string, value: unknown) => void
  clearFormData: () => void
  isDirty: boolean
  setIsDirty: (dirty: boolean) => void
  
  // 订单明细（特殊处理）
  orderItems: Array<{
    productId: string
    productName: string
    quantity: number
    unitPrice: number
    discount: number
    amount: number
  }>
  setOrderItems: (items: OrderFormState['orderItems']) => void
  addOrderItem: (item: OrderFormState['orderItems'][0]) => void
  updateOrderItem: (index: number, item: Partial<OrderFormState['orderItems'][0]>) => void
  removeOrderItem: (index: number) => void
  calculateTotal: () => number
  
  savedDraft: Record<string, unknown> | null
  saveDraft: () => void
  loadDraft: () => void
  clearDraft: () => void
}

export const useOrderFormStore = create<OrderFormState>()(
  persist(
    (set, get) => ({
      formData: {},
      setFormData: (data) => set({ formData: data, isDirty: true }),
      updateField: (field, value) => set((state) => ({
        formData: { ...state.formData, [field]: value },
        isDirty: true,
      })),
      clearFormData: () => set({ formData: {}, isDirty: false, orderItems: [] }),
      isDirty: false,
      setIsDirty: (dirty) => set({ isDirty: dirty }),
      
      orderItems: [],
      setOrderItems: (items) => set({ orderItems: items, isDirty: true }),
      addOrderItem: (item) => set((state) => ({
        orderItems: [...state.orderItems, item],
        isDirty: true,
      })),
      updateOrderItem: (index, item) => set((state) => ({
        orderItems: state.orderItems.map((i, idx) =>
          idx === index ? { ...i, ...item } : i
        ),
        isDirty: true,
      })),
      removeOrderItem: (index) => set((state) => ({
        orderItems: state.orderItems.filter((_, idx) => idx !== index),
        isDirty: true,
      })),
      calculateTotal: () => {
        const items = get().orderItems
        return items.reduce((sum, item) => sum + item.amount, 0)
      },
      
      savedDraft: null,
      saveDraft: () => set({
        savedDraft: {
          ...get().formData,
          items: get().orderItems,
        },
      }),
      loadDraft: () => {
        const draft = get().savedDraft
        if (draft) {
          set({
            formData: draft,
            orderItems: (draft.items as OrderFormState['orderItems']) || [],
            isDirty: true,
          })
        }
      },
      clearDraft: () => set({ savedDraft: null }),
    }),
    {
      name: 'order-form-store',
      partialize: (state) => ({
        savedDraft: state.savedDraft,
      }),
    }
  )
)

// ============ Contract Form Store ============

interface ContractFormState {
  formData: Record<string, unknown>
  setFormData: (data: Record<string, unknown>) => void
  updateField: (field: string, value: unknown) => void
  clearFormData: () => void
  isDirty: boolean
  setIsDirty: (dirty: boolean) => void
  savedDraft: Record<string, unknown> | null
  saveDraft: () => void
  loadDraft: () => void
  clearDraft: () => void
}

export const useContractFormStore = create<ContractFormState>()(
  persist(
    (set, get) => ({
      formData: {},
      setFormData: (data) => set({ formData: data, isDirty: true }),
      updateField: (field, value) => set((state) => ({
        formData: { ...state.formData, [field]: value },
        isDirty: true,
      })),
      clearFormData: () => set({ formData: {}, isDirty: false }),
      isDirty: false,
      setIsDirty: (dirty) => set({ isDirty: dirty }),
      savedDraft: null,
      saveDraft: () => set({ savedDraft: get().formData }),
      loadDraft: () => set({ formData: get().savedDraft || {}, isDirty: true }),
      clearDraft: () => set({ savedDraft: null }),
    }),
    {
      name: 'contract-form-store',
      partialize: (state) => ({
        savedDraft: state.savedDraft,
      }),
    }
  )
)

// ============ Payment Form Store ============

interface PaymentFormState {
  formData: Record<string, unknown>
  setFormData: (data: Record<string, unknown>) => void
  updateField: (field: string, value: unknown) => void
  clearFormData: () => void
  isDirty: boolean
  setIsDirty: (dirty: boolean) => void
  savedDraft: Record<string, unknown> | null
  saveDraft: () => void
  loadDraft: () => void
  clearDraft: () => void
}

export const usePaymentFormStore = create<PaymentFormState>()(
  persist(
    (set, get) => ({
      formData: {},
      setFormData: (data) => set({ formData: data, isDirty: true }),
      updateField: (field, value) => set((state) => ({
        formData: { ...state.formData, [field]: value },
        isDirty: true,
      })),
      clearFormData: () => set({ formData: {}, isDirty: false }),
      isDirty: false,
      setIsDirty: (dirty) => set({ isDirty: dirty }),
      savedDraft: null,
      saveDraft: () => set({ savedDraft: get().formData }),
      loadDraft: () => set({ formData: get().savedDraft || {}, isDirty: true }),
      clearDraft: () => set({ savedDraft: null }),
    }),
    {
      name: 'payment-form-store',
      partialize: (state) => ({
        savedDraft: state.savedDraft,
      }),
    }
  )
)

// ============ Product Form Store ============

interface ProductFormState {
  formData: Record<string, unknown>
  setFormData: (data: Record<string, unknown>) => void
  updateField: (field: string, value: unknown) => void
  clearFormData: () => void
  isDirty: boolean
  setIsDirty: (dirty: boolean) => void
  savedDraft: Record<string, unknown> | null
  saveDraft: () => void
  loadDraft: () => void
  clearDraft: () => void
}

export const useProductFormStore = create<ProductFormState>()(
  persist(
    (set, get) => ({
      formData: {},
      setFormData: (data) => set({ formData: data, isDirty: true }),
      updateField: (field, value) => set((state) => ({
        formData: { ...state.formData, [field]: value },
        isDirty: true,
      })),
      clearFormData: () => set({ formData: {}, isDirty: false }),
      isDirty: false,
      setIsDirty: (dirty) => set({ isDirty: dirty }),
      savedDraft: null,
      saveDraft: () => set({ savedDraft: get().formData }),
      loadDraft: () => set({ formData: get().savedDraft || {}, isDirty: true }),
      clearDraft: () => set({ savedDraft: null }),
    }),
    {
      name: 'product-form-store',
      partialize: (state) => ({
        savedDraft: state.savedDraft,
      }),
    }
  )
)