/**
 * Pages barrel export
 *
 * Usage:
 * import { ContractList, ContractDetail } from '@/pages'
 */

// ============ Contract ============
export { ContractList } from "./ContractList"
export { ContractDetail } from "./ContractDetail"

// ============ Quote (CPQ) ============
export { QuoteListPage } from "./QuoteList"
export { QuoteDetailPage } from "./QuoteDetail"
export { default as QuoteNewPage } from "./quotes/QuoteNew"
export { QuoteBuilderPage } from "./quotes/QuoteBuilder"

// ============ Payment ============
export { PaymentList } from "./PaymentList"
export { PaymentDetail } from "./PaymentDetail"

// ============ Order ============
export { OrderList } from "./OrderList"
export { OrderDetail } from "./OrderDetail"

// ============ Product ============
export { ProductList } from "./products/ProductList"
export { ProductDetail } from "./products/ProductDetail"

// ============ Pricebook ============
export { PricebookList } from "./pricebooks/PricebookList"
export { PricebookDetail } from "./pricebooks/PricebookDetail"

// ============ Customer ============
export { HighSeasPool } from "./customers/HighSeasPool"

// ============ Opportunity ============
export { OpportunityList } from "./OpportunityList"
export { OpportunityDetail } from "./OpportunityDetail"
export { OpportunityKanban } from "./OpportunityKanban"

// ============ Admin (System Management) ============
export {
  UserManagementPage,
  RoleManagementPage,
  PermissionManagementPage,
} from "./admin"

// ============ Others (Help, Docs, Legal) ============
export {
  HelpCenter,
  Documentation,
  Feedback,
  Changelog,
  About,
  Terms,
  Privacy,
} from "./others"