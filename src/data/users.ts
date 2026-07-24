import type { Role, UserAccount } from "../types";

export const ROLES: Role[] = [
  {
    id: "client",
    label: "Client",
    description: "Individual taxpayer working through their own return.",
  },
  {
    id: "business_owner",
    label: "Business Owner",
    description:
      "Owns a business return in addition to (sometimes) a personal one.",
  },
  {
    id: "preparer",
    label: "Preparer",
    description: "Prepares returns for assigned clients.",
  },
  {
    id: "reviewer",
    label: "Reviewer",
    description: "Senior staff who reviews and signs off before filing.",
  },
  {
    id: "admin",
    label: "Firm Admin",
    description: "Manages staff, assignments, and firm-wide workload.",
  },
  {
    id: "seasonal_staff",
    label: "Seasonal Staff",
    description: "Temporary preparer, narrower access, simplified queue.",
  },
];

export const USERS: UserAccount[] = [
  {
    id: "u_client_maria",
    name: "Maria Delgado",
    initials: "MD",
    email: "maria.delgado@example.com",
    roles: ["client"],
  },
  {
    id: "u_client_owen",
    name: "Owen Fitch",
    initials: "OF",
    email: "owen@fitchwoodworks.example.com",
    roles: ["business_owner"],
  },
  {
    id: "u_preparer_dana",
    name: "Dana Whitfield, CPA",
    initials: "DW",
    email: "dana@northgatecpa.example.com",
    roles: ["preparer"],
    firmId: "northgate",
  },
  {
    id: "u_reviewer_sam",
    name: "Sam Okafor, EA",
    initials: "SO",
    email: "sam@northgatecpa.example.com",
    roles: ["reviewer"],
    firmId: "northgate",
  },
  {
    id: "u_admin_priya",
    name: "Priya Nandan",
    initials: "PN",
    email: "priya@northgatecpa.example.com",
    roles: ["admin"],
    firmId: "northgate",
  },
  {
    id: "u_seasonal_theo",
    name: "Theo Marsh",
    initials: "TM",
    email: "theo@northgatecpa.example.com",
    roles: ["seasonal_staff"],
    firmId: "northgate",
  },
  // Challenge 5 solution
  {
    id: "u_dana_personal",
    name: "Dana Whitfield, CPA",
    initials: "DW",
    email: "dana@northgatecpa.example.com",
    roles: ["preparer", "client"],
    firmId: "northgate",
  },
  // Challenge 3 solution
  {
    id: "u_new_client_jordan",
    name: "Jordan Ellery",
    initials: "JE",
    email: "jordan.ellery@example.com",
    roles: ["client"],
  },
];

export const CURRENT_FIRM_ID = "northgate";
