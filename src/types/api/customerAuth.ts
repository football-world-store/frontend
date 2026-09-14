export interface RegisterCustomerBody {
  name: string;
  email: string;
  password: string;
  whatsapp: string;
  birthDate?: string;
}

export interface CustomerIdentity {
  id: string;
  name: string;
  email: string;
}

export interface UpdateCustomerProfileBody {
  name?: string;
  whatsapp?: string;
  favoriteTeam?: string;
  preferredSizes?: string[];
  birthDate?: string;
}

export interface CustomerProfile {
  id: string;
  name: string;
  email: string | null;
  whatsapp: string;
  favoriteTeam: string | null;
  preferredSizes: string[];
  birthDate: string | null;
  status: string;
  createdAt: string;
}

export interface ChangeCustomerPasswordBody {
  currentPassword: string;
  newPassword: string;
}
