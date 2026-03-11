import type { PolicySource } from "@/lib/types/policy";

export const policyTierRank: Record<PolicySource["tier"], number> = {
  federal: 5,
  state: 4,
  "uw-system": 3,
  uwo: 2,
  department: 1
};

export const approvedPolicySources: PolicySource[] = [
  {
    id: "dol-fmla",
    title: "U.S. Department of Labor - FMLA Overview",
    url: "https://www.dol.gov/general/topic/benefits-leave/fmla",
    tier: "federal",
    owner: "U.S. Department of Labor",
    approved: true
  },
  {
    id: "wisconsin-family-leave",
    title: "Wisconsin Family and Medical Leave Act",
    url: "https://dwd.wisconsin.gov/er/civilrights/fmla/",
    tier: "state",
    owner: "Wisconsin DWD",
    approved: true
  },
  {
    id: "uw-oshkosh-hr",
    title: "UW Oshkosh Human Resources",
    url: "https://www.uwosh.edu/hr/",
    tier: "uwo",
    owner: "UW Oshkosh",
    approved: true
  }
];
