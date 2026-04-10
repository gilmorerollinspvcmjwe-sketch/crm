/**
 * Zod Schemas barrel export
 *
 * Usage:
 * import { contactSchema, type ContactFormValues } from '@/schemas'
 * import { customerSchema, type CustomerFormValues } from '@/schemas'
 * import { productSchema, type ProductFormValues } from '@/schemas'
 */

// ============ Contact ============

export { contactSchema, contactCreateSchema, contactUpdateSchema } from "./contactSchema"
export type { ContactFormValues, ContactCreateFormValues, ContactUpdateFormValues } from "./contactSchema"

// ============ Customer ============

export { customerSchema, customerCreateSchema, customerUpdateSchema } from "./customerSchema"
export type { CustomerFormValues, CustomerCreateFormValues, CustomerUpdateFormValues } from "./customerSchema"

// ============ Product ============

export { productSchema, productCreateSchema, productUpdateSchema } from "./productSchema"
export type { ProductFormValues, ProductCreateFormValues, ProductUpdateFormValues } from "./productSchema"

// ============ Contract ============

export { contractSchema, contractCreateSchema, contractUpdateSchema, contractTypeOptions, paymentMethodOptions, currencyOptions } from "./contractSchema"
export type { ContractFormValues, ContractCreateFormValues, ContractUpdateFormValues, ContractType, PaymentMethod, Currency } from "./contractSchema"

// ============ PaymentPlan ============

export { paymentPlanSchema, paymentPlanCreateSchema, paymentPlanUpdateSchema, paymentPlanStatusOptions } from "./paymentPlanSchema"
export type { PaymentPlanFormValues, PaymentPlanCreateFormValues, PaymentPlanUpdateFormValues, PaymentPlanStatus } from "./paymentPlanSchema"

// ============ Payment ============

export { paymentSchema, paymentCreateSchema, paymentUpdateSchema } from "./paymentSchema"
export type { PaymentFormValues, PaymentCreateFormValues, PaymentUpdateFormValues } from "./paymentSchema"

// ============ Order ============

export { orderSchema, orderCreateSchema, orderUpdateSchema, orderItemSchema } from "./orderSchema"
export type { OrderFormValues, OrderCreateFormValues, OrderUpdateFormValues, OrderItemFormValues } from "./orderSchema"

// ============ Pricebook ============

export { pricebookSchema, pricebookCreateSchema, pricebookUpdateSchema, pricebookEntrySchema } from "./pricebookSchema"
export type { PricebookFormValues, PricebookCreateFormValues, PricebookUpdateFormValues, PricebookEntryFormValues } from "./pricebookSchema"

// ============ Lead ============

export { leadSchema, leadCreateSchema, leadUpdateSchema } from "./leadSchema"
export type { LeadFormValues, LeadCreateFormValues, LeadUpdateFormValues } from "./leadSchema"

// ============ Opportunity ============

export { opportunitySchema, opportunityCreateSchema, opportunityUpdateSchema } from "./opportunitySchema"
export type { OpportunityFormValues, OpportunityCreateFormValues, OpportunityUpdateFormValues } from "./opportunitySchema"

// ============ Settings Schemas ============

export {
  profileSettingsSchema,
  securitySettingsSchema,
  preferencesSettingsSchema,
  notificationSettingsSchema,
  type ProfileSettingsFormValues,
  type SecuritySettingsFormValues,
  type PreferencesSettingsFormValues,
  type NotificationSettingsFormValues,
} from './settingsSchema'

// ============ AI Schemas ============

export {
  aiConfigSchema,
  aiPromptTemplateSchema,
  type AIConfigFormValues,
  type AIPromptTemplateFormValues,
} from './aiSchema'

// ============ Marketing Schemas ============

export {
  campaignSchema,
  emailSchema,
  emailTemplateSchema,
  type CampaignFormValues,
  type EmailFormValues,
  type EmailTemplateFormValues,
} from './marketingSchema'

// ============ User & Role Schemas ============

export {
  userSchema,
  userCreateSchema,
  userUpdateSchema,
  changePasswordSchema,
  resetPasswordSchema,
  type UserFormData,
  type UserCreateFormData,
  type UserUpdateFormData,
  type ChangePasswordFormData,
  type ResetPasswordFormData,
} from './userSchema'

export {
  roleSchema,
  rolePermissionSchema,
  batchAssignRolesSchema,
  type RoleFormData,
  type RolePermissionFormData,
  type BatchAssignRolesFormData,
} from './roleSchema'

// ============ Custom Field & Object Schemas ============

export {
  customFieldSchema,
  fieldValidationSchema,
  fieldOptionSchema,
  fieldGroupSchema,
  updateFieldOrderSchema,
  type CustomFieldFormData,
  type FieldValidation,
  type FieldOption,
  type FieldGroupFormData,
  type UpdateFieldOrderFormData,
} from './customFieldSchema'

export {
  customObjectSchema,
  objectRelationSchema,
  layoutSchema,
  listViewSchema,
  type CustomObjectFormData,
  type ObjectRelationFormData,
  type LayoutFormData,
  type ListViewFormData,
} from './customObjectSchema'

// ============ Shared Types ============

/** Common form modes */
export type FormMode = "create" | "edit" | "view"

/** Common API response wrapper */
export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}

/** Pagination params */
export interface PaginationParams {
  page: number
  pageSize: number
  total?: number
}

/** Select option type */
export interface SelectOption {
  label: string
  value: string | number
  disabled?: boolean
}