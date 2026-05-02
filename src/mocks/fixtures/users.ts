import type { SystemUser } from "@/types";

export const usersFixture: SystemUser[] = [
  {
    id: "u-001",
    name: "Edimilson Junior",
    email: "dono@footballworld.com",
    role: "OWNER",
    isActive: true,
    createdAt: "2025-08-01T10:00:00.000Z",
    updatedAt: "2026-04-26T08:00:00.000Z",
  },
  {
    id: "u-002",
    name: "Maria Silva",
    email: "esposa@footballworld.com",
    role: "OWNER",
    isActive: true,
    createdAt: "2025-09-12T10:00:00.000Z",
    updatedAt: "2026-04-25T17:00:00.000Z",
  },
  {
    id: "u-003",
    name: "Thiago Silva",
    email: "thiago@footballworld.com",
    role: "EMPLOYEE",
    isActive: true,
    createdAt: "2026-02-01T10:00:00.000Z",
    updatedAt: "2026-04-26T07:30:00.000Z",
  },
];
