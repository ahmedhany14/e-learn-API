export interface IGetAccount {
  id: number;
  email: string;
  role: string;
  is_active: boolean;
}

export interface IDeactivateAccount {
  id: number;
  is_active: boolean;
}

export interface IDeleteAccount {
  id: number;
  email: string;
  role: string;
  is_active: boolean;
}

export interface IUpgradeToInstructor {
  id: number;
  email: string;
}