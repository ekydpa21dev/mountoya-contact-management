export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string;
  photo: string;
  location: {
    latitude: number;
    longitude: number;
    address?: {
      'ISO3166-2-lvl3'?: string;
      'ISO3166-2-lvl4'?: string;
      city?: string;
      city_block?: string;
      county?: string;
      country?: string;
      country_code?: string;
      display_name?: string;
      neighbourhood?: string;
      postcode?: string;
      region?: string;
      road?: string;
      suburb?: string;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

// Simplified input type for adding/updating contacts
export interface ContactInput {
  name: string;
  phone: string;
  email: string;
  photo: string;
  location: {
    latitude: number;
    longitude: number;
  };
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

export interface ContactsContextType {
  contacts: Contact[];
  loading: boolean;
  error: string | null;
  addContact: (contact: ContactInput) => Promise<void>;
  updateContact: (id: string, contact: ContactInput) => Promise<void>;
  deleteContact: (id: string) => Promise<void>;
  getContact: (id: string) => Contact | undefined;
}

export interface ValidationError {
  field: string;
  message: string;
}
