// import { IAccessControlPermissionListResponse } from "../interfaces/index.interface";

// export const dummyResponse: IAccessControlPermissionListResponse = {
//   statusCode: 200,
//   message: "Success",
//   data: [
//     {
//       id: "cat-1",
//       name: "Store",
//       permissions: [
//         {
//           id: "perm-1",
//           name: "Access All Store",
//           code: "STORE_ACCESS_ALL",
//           storeRolePermissions: [
//             { id: "role-1", name: "Owner" },
//             { id: "role-2", name: "Manager" },
//           ],
//         },
//         {
//           id: "perm-2",
//           name: "Store Management",
//           code: "STORE_MANAGEMENT",
//           storeRolePermissions: [
//             { id: "role-1", name: "Owner" },
//             { id: "role-2", name: "Manager" },
//           ],
//         },
//       ],
//     },
//     {
//       id: "cat-2",
//       name: "General",
//       permissions: [
//         {
//           id: "perm-3",
//           name: "Dashboard View",
//           code: "GENERAL_DASHBOARD_VIEW",
//           storeRolePermissions: [
//             { id: "role-1", name: "Owner" },
//             { id: "role-2", name: "Manager" },
//             { id: "role-3", name: "Supervisor" },
//           ],
//         },
//         {
//           id: "perm-4",
//           name: "Reports",
//           code: "GENERAL_REPORTS",
//           storeRolePermissions: [
//             { id: "role-1", name: "Owner" },
//             { id: "role-2", name: "Manager" },
//           ],
//         },
//         {
//           id: "perm-5",
//           name: "Accounts",
//           code: "GENERAL_ACCOUNTS",
//           storeRolePermissions: [{ id: "role-1", name: "Owner" }],
//         },
//         {
//           id: "perm-6",
//           name: "Connected Device Configuration",
//           code: "GENERAL_CONNECTED_DEVICE",
//           storeRolePermissions: [{ id: "role-1", name: "Owner" }],
//         },
//         {
//           id: "perm-7",
//           name: "Payment Method Configuration",
//           code: "GENERAL_PAYMENT_METHOD",
//           storeRolePermissions: [
//             { id: "role-1", name: "Owner" },
//             { id: "role-2", name: "Manager" },
//           ],
//         },
//         {
//           id: "perm-8",
//           name: "General Loyalty Point Configuration",
//           code: "GENERAL_LOYALTY_POINT",
//           storeRolePermissions: [{ id: "role-1", name: "Owner" }],
//         },
//         {
//           id: "perm-9",
//           name: "Tax & Service Charge Configuration",
//           code: "GENERAL_TAX_SERVICE_CHARGE",
//           storeRolePermissions: [{ id: "role-1", name: "Owner" }],
//         },
//         {
//           id: "perm-10",
//           name: "Invoice Templates",
//           code: "GENERAL_INVOICE_TEMPLATES",
//           storeRolePermissions: [{ id: "role-1", name: "Owner" }],
//         },
//       ],
//     },
//     {
//       id: "cat-3",
//       name: "Product",
//       permissions: [
//         {
//           id: "perm-11",
//           name: "Product Category",
//           code: "PRODUCT_CATEGORY",
//           storeRolePermissions: [
//             { id: "role-1", name: "Owner" },
//             { id: "role-2", name: "Manager" },
//           ],
//         },
//         {
//           id: "perm-12",
//           name: "Product Management",
//           code: "PRODUCT_MANAGEMENT",
//           storeRolePermissions: [
//             { id: "role-1", name: "Owner" },
//             { id: "role-2", name: "Manager" },
//           ],
//         },
//         {
//           id: "perm-13",
//           name: "Set Discount Price",
//           code: "PRODUCT_SET_DISCOUNT_PRICE",
//           storeRolePermissions: [
//             { id: "role-1", name: "Owner" },
//             { id: "role-2", name: "Manager" },
//           ],
//         },
//       ],
//     },
//     {
//       id: "cat-4",
//       name: "Sales",
//       permissions: [
//         {
//           id: "perm-14",
//           name: "Set Up Cash Drawer",
//           code: "SALES_SETUP_CASH_DRAWER",
//           storeRolePermissions: [
//             { id: "role-1", name: "Owner" },
//             { id: "role-2", name: "Manager" },
//           ],
//         },
//         {
//           id: "perm-15",
//           name: "Close Cash Register",
//           code: "SALES_CLOSE_CASH_REGISTER",
//           storeRolePermissions: [
//             { id: "role-1", name: "Owner" },
//             { id: "role-2", name: "Manager" },
//           ],
//         },
//         {
//           id: "perm-16",
//           name: "Daily Sales",
//           code: "SALES_DAILY_SALES",
//           storeRolePermissions: [{ id: "role-1", name: "Owner" }],
//         },
//         {
//           id: "perm-17",
//           name: "Check Out Sales",
//           code: "SALES_CHECKOUT_SALES",
//           storeRolePermissions: [
//             { id: "role-1", name: "Owner" },
//             { id: "role-4", name: "Cashier" },
//           ],
//         },
//         {
//           id: "perm-18",
//           name: "Cancel Invoice",
//           code: "SALES_CANCEL_INVOICE",
//           storeRolePermissions: [{ id: "role-1", name: "Owner" }],
//         },
//         {
//           id: "perm-19",
//           name: "Refund Invoice",
//           code: "SALES_REFUND_INVOICE",
//           storeRolePermissions: [{ id: "role-1", name: "Owner" }],
//         },
//         {
//           id: "perm-20",
//           name: "Process Unpaid Invoice",
//           code: "SALES_PROCESS_UNPAID_INVOICE",
//           storeRolePermissions: [{ id: "role-1", name: "Owner" }],
//         },
//         {
//           id: "perm-21",
//           name: "Voucher",
//           code: "SALES_VOUCHER",
//           storeRolePermissions: [
//             { id: "role-1", name: "Owner" },
//             { id: "role-2", name: "Manager" },
//           ],
//         },
//         {
//           id: "perm-22",
//           name: "Cash In/Out",
//           code: "SALES_CASH_IN_OUT",
//           storeRolePermissions: [
//             { id: "role-1", name: "Owner" },
//             { id: "role-2", name: "Manager" },
//           ],
//         },
//       ],
//     },
//     {
//       id: "cat-5",
//       name: "Customer",
//       permissions: [
//         {
//           id: "perm-23",
//           name: "Customer Management",
//           code: "CUSTOMER_MANAGEMENT",
//           storeRolePermissions: [
//             { id: "role-1", name: "Owner" },
//             { id: "role-2", name: "Manager" },
//           ],
//         },
//         {
//           id: "perm-24",
//           name: "View Customer Profile",
//           code: "CUSTOMER_VIEW_PROFILE",
//           storeRolePermissions: [
//             { id: "role-1", name: "Owner" },
//             { id: "role-2", name: "Manager" },
//           ],
//         },
//         {
//           id: "perm-25",
//           name: "Manage Customer Loyalty Point",
//           code: "CUSTOMER_MANAGE_LOYALTY_POINT",
//           storeRolePermissions: [{ id: "role-1", name: "Owner" }],
//         },
//       ],
//     },
//     {
//       id: "cat-6",
//       name: "Supplier",
//       permissions: [
//         {
//           id: "perm-26",
//           name: "Supplier Management",
//           code: "SUPPLIER_MANAGEMENT",
//           storeRolePermissions: [
//             { id: "role-1", name: "Owner" },
//             { id: "role-2", name: "Manager" },
//           ],
//         },
//         {
//           id: "perm-27",
//           name: "View Supplier Details",
//           code: "SUPPLIER_VIEW_DETAILS",
//           storeRolePermissions: [{ id: "role-1", name: "Owner" }],
//         },
//         {
//           id: "perm-28",
//           name: "Category Management",
//           code: "SUPPLIER_CATEGORY_MANAGEMENT",
//           storeRolePermissions: [
//             { id: "role-1", name: "Owner" },
//             { id: "role-2", name: "Manager" },
//           ],
//         },
//         {
//           id: "perm-29",
//           name: "Manage Item",
//           code: "SUPPLIER_MANAGE_ITEM",
//           storeRolePermissions: [{ id: "role-1", name: "Owner" }],
//         },
//         {
//           id: "perm-30",
//           name: "Stock Adjustment",
//           code: "SUPPLIER_STOCK_ADJUSTMENT",
//           storeRolePermissions: [{ id: "role-1", name: "Owner" }],
//         },
//       ],
//     },
//     {
//       id: "cat-7",
//       name: "Purchase",
//       permissions: [
//         {
//           id: "perm-31",
//           name: "Manage Purchase Order",
//           code: "PURCHASE_MANAGE_ORDER",
//           storeRolePermissions: [
//             { id: "role-1", name: "Owner" },
//             { id: "role-2", name: "Manager" },
//           ],
//         },
//       ],
//     },
//     {
//       id: "cat-8",
//       name: "Staff",
//       permissions: [
//         {
//           id: "perm-32",
//           name: "Manage Staff Members",
//           code: "STAFF_MANAGE_MEMBERS",
//           storeRolePermissions: [{ id: "role-1", name: "Owner" }],
//         },
//         {
//           id: "perm-33",
//           name: "Set Staff Commissions",
//           code: "STAFF_SET_COMMISSIONS",
//           storeRolePermissions: [{ id: "role-1", name: "Owner" }],
//         },
//         {
//           id: "perm-34",
//           name: "Staff Shift",
//           code: "STAFF_SHIFT",
//           storeRolePermissions: [
//             { id: "role-1", name: "Owner" },
//             { id: "role-2", name: "Manager" },
//           ],
//         },
//         {
//           id: "perm-35",
//           name: "Manage Staff Attendance",
//           code: "STAFF_MANAGE_ATTENDANCE",
//           storeRolePermissions: [
//             { id: "role-1", name: "Owner" },
//             { id: "role-2", name: "Manager" },
//           ],
//         },
//       ],
//     },
//   ],
// };


