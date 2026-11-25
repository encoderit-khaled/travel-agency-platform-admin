export { AdminLoginPage, TroubleSigningInPage } from './admin-login-page'
export type { AdminLoginPageProps } from './admin-login-page'
export { AdminSidebar } from './admin-sidebar'
export { AdminHeader } from './admin-header'
export { Navbar } from '#/components/ui/navbar'
export type { NavbarProps } from '#/components/ui/navbar'
export { AdminFooter } from './admin-footer'
export { StatusMetricCard } from './status-metric-card'
export type { ApplicationStatus } from './status-metric-card'
export { AgentApplicationsTable } from './agent-applications-table'
export { ApplicationReviewModal } from './application-review-modal'
export { ApplicationReviewView } from './application-review-view'
export { ApplicationReviewPage } from './application-review-page'
export { ApproveApplicationModal } from './approve-application-modal'
export { ApproveApplicationDialog } from './approve-application-dialog'
export { RejectApplicationModal } from './reject-application-modal'
export { RejectApplicationDialog } from './reject-application-dialog'
export { SuspendAgentModal } from './suspend-agent-modal'
export { AdminAgentApplicationsPage } from './admin-agent-applications-page'
export { INITIAL_APPLICATIONS } from './data'
export { EmptyState } from '#/components/ui/empty-state'
export type { EmptyStateProps, ActiveFilter } from '#/components/ui/empty-state'
export type { AgentApplication, ApplicationDocument } from './types'

// Admin Roles & Permissions (M15 · #984:976 & #984:1859)
export { AdminRolesPermissionsPage } from './admin-roles-permissions-page'
export type { AdminRolesPermissionsPageProps } from './admin-roles-permissions-page'
export { EditPermissionsDialog } from './edit-permissions-dialog'
export {
  ADMIN_ROLES,
  CORE_ADMIN_AREAS,
  PLATFORM_MODULE_AREAS,
  ALL_PERMISSION_AREAS,
  INITIAL_ROLE_PERMISSION_MATRIX,
} from './admin-roles-permissions-data'
export type {
  AdminRoleId,
  PermissionStatus,
  AdminRole,
  PermissionAreaItem,
  RolePermissionMatrix,
} from './admin-roles-permissions-types'

// B2C Customers (M15 · #984:2269 & #990:2945)
export { B2CCustomerDetailsPage } from './b2c-customer-details-page'
export type { B2CCustomerDetailsPageProps } from './b2c-customer-details-page'
export {
  B2CCustomersPage,
  B2CCustomerDetailsView,
  EditCustomerDialog,
  SignInBadge,
  GoogleIcon,
  INITIAL_B2C_CUSTOMERS,
} from './b2c-customers'
export type {
  B2CCustomersPageProps,
  B2CCustomer,
  SignInMethod,
  SignInMethodFilter,
} from './b2c-customers'

// Admin Users (M15 · #975:3024)
export { AdminUsersPage } from './admin-users-page'
export { AddAdminUserDialog } from './add-admin-user-dialog'
export { ManageUserDialog } from './manage-user-dialog'
export { RolesOverviewDialog } from './roles-overview-dialog'
export { INITIAL_ADMIN_USERS, PREDEFINED_ROLES } from './admin-users-data'
export type { AdminUser, AdminRole as AdminUserRole } from './admin-users-data'

// Admin Dashboard (M15 · #972:2051 & #972:2052)
export { AdminDashboardPage } from './admin-dashboard-page'
export type { AdminDashboardPageProps } from './admin-dashboard-page'
export {
  DASHBOARD_KPIS,
  TOTAL_BOOKINGS,
  BOOKING_STATUSES,
  QUICK_ACCESS_ITEMS,
  RECENT_ADMIN_ACTIVITIES,
  ADMIN_USERS_BY_ROLE,
} from './dashboard-data'
export type {
  DashboardKpiItem,
  BookingStatusItem,
  QuickAccessItem,
  AdminActivityItem,
  AdminRoleItem as DashboardAdminRoleItem,
} from './dashboard-data'

// Admin Audit Log (M15 · #995:3669)
export { AdminAuditLogPage } from './admin-audit-log-page'
export type {
  AdminAuditLogPageProps,
  AuditLogItem,
  AuditAreaFilter,
  AuditAdminFilter,
} from './admin-audit-log-types'
export {
  INITIAL_AUDIT_LOGS,
  AUDIT_AREAS,
  AUDIT_ADMINS,
} from './admin-audit-log-data'

// Admin Reports - Sales (M15 · #1005:4738)
export { AdminReportsSalesPage } from './admin-reports-sales-page'
export type {
  AdminReportsSalesPageProps,
  SalesReportRow,
  ServiceSalesBreakdown,
  SalesReportFilters,
} from './admin-reports-sales-types'
export {
  REPORT_TABS,
  SERVICES_FILTER_OPTIONS,
  SUPPLIERS_FILTER_OPTIONS,
  CHANNELS_FILTER_OPTIONS,
  INITIAL_SALES_REPORT_ROWS,
  INITIAL_SERVICE_BREAKDOWNS,
} from './admin-reports-sales-data'

// Admin Reports - Bookings (M15 · #1005:5341 / #1005:5344) & Payments (#1005:5345)
export { AdminReportsPage } from './admin-reports-page'
export { BookingDetailsDialog } from './booking-details-dialog'
export { ExportReportDialog } from './export-report-dialog'
export {
  INITIAL_BOOKING_RECORDS,
  BOOKINGS_BY_SERVICE_ITEMS,
  BOOKINGS_BY_STATUS_ITEMS,
  BOOKINGS_BY_CHANNEL_ITEMS,
  BOOKINGS_BY_SUPPLIER_ITEMS,
  INITIAL_BOOKINGS_KPIS,
} from './admin-reports-bookings-data'
export type {
  BookingRecordItem,
  BookingStatus,
  BookingService,
  BookingChannel,
  BookingBreakdownItem,
  BookingsKpiMetrics,
} from './admin-reports-bookings-types'
export type {
  AdminReportsPageProps,
  PaymentReportItem,
  PaymentStatus,
  PaymentStatusSummary,
  AdminReportsFilterState,
  ReportTab,
} from './admin-reports-types'
export {
  INITIAL_PAYMENT_REPORTS,
  REPORT_SERVICES,
  REPORT_SUPPLIERS,
  REPORT_CHANNELS,
} from './admin-reports-data'

// Admin Reports - Commissions (M15 · #1005:5346)
export {
  AdminReportsCommissionsPage,
  AdminReportsExportDialog,
  INITIAL_COMMISSION_ROWS,
  INITIAL_SERVICE_BREAKDOWN,
} from './admin-reports'
export type {
  CommissionReportRow,
  ServiceBreakdownItem,
  CommissionStatus as AdminCommissionStatus,
} from './admin-reports'

// Platform settings screens
export {
  BusinessDetailsPage,
  EditBusinessDetailsDialog,
  LanguagesPage,
  ConfigureLanguagesDialog,
  CurrenciesExchangeRatesPage,
  TaxDefaultsPage,
  CancellationPoliciesPage,
  INITIAL_BUSINESS_DETAILS,
  SETTINGS_NAVIGATION_SECTIONS,
  OTHER_SETTINGS_CARDS,
  INITIAL_LANGUAGES,
} from './platform-settings'
export type {
  BusinessDetailsConfig,
  PlatformSettingsSection,
  OtherSettingsCard,
  BusinessDetailsPageProps,
  EditBusinessDetailsDialogProps,
  LanguageItem,
  LanguagesPageProps,
  ConfigureLanguagesDialogProps,
  ExchangeRateItem,
  DisplayCurrencyItem,
  CurrenciesExchangeRatesPageProps,
  TaxDefaultValues,
  TaxDefaultsPageProps,
  TaxDefaultsConfig,
  CancellationPolicy,
  CancellationPoliciesMode,
  CancellationPoliciesPageProps,
} from './platform-settings'
