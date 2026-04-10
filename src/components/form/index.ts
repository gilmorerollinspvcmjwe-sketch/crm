/**
 * Form Component Library
 *
 * Architecture:
 * - FormProvider.tsx  : useForm hook + layout helpers (FormGrid, FormSection, FormActions, FormRoot)
 * - FormField.tsx     : Smart field wrapper with auto label/description/error rendering
 * - FormLabel.tsx     : Enhanced label with required/optional indicators
 * - FormError.tsx     : Error and help text components
 *
 * Usage:
 * import { Form, FormField, FormGrid, FormSection, FormActions } from '@/components/form'
 *
 * Or import individual:
 * import { FormRoot, FormGrid } from '@/components/form/FormProvider'
 */

export { FormRoot, FormGrid, FormSection, FormActions, FormProvider } from "./FormProvider"
export type {
  FormProviderProps,
  FormGridProps,
  FormSectionProps,
  FormActionsProps,
} from "./FormProvider"

export { FormField } from "./FormField"
export type { FormFieldExtendedProps } from "./FormField"

export { FormLabel } from "./FormLabel"
export type { FormLabelProps } from "./FormLabel"

export { FormError, FormInlineError, FormHelpText } from "./FormError"
export type { FormErrorProps, FormInlineErrorProps, FormHelpTextProps } from "./FormError"
