import { Generated, Insertable, Selectable, Updateable } from "kysely";

export interface Database {
  user: UserTable;
  medicine: MedicineTable;
  treatment: TreatmentTable;
  medicine_treatment: MedicineTreatmentTable;
  intake: IntakeTable;
}

export interface UserTable {
  id: Generated<number>;
  name: string;
  email: string;
  password: string;
  birthdate: Date | null;
  profile_picture: string | null;
  gender: string | null;
}

export type User = Selectable<UserTable>;
export type NewUser = Insertable<UserTable>;
export type UserUpdate = Updateable<UserTable>;

export interface MedicineTable {
  id: Generated<number>;
  pactive: string;
  picture: string | null;
  trade_name: string;
  dose: string | null;
  unit: string | null;
}

export type Medicine = Selectable<MedicineTable>;
export type NewMedicine = Insertable<MedicineTable>;
export type MedicineUpdate = Updateable<MedicineTable>;

export interface TreatmentTable {
  id: Generated<number>;
  name: string;
  user_id: number;
  start_date: Date | null;
  end_date: Date | null;
}

export type Treatment = Selectable<TreatmentTable>;
export type NewTreatment = Insertable<TreatmentTable>;
export type TreatmentUpdate = Updateable<TreatmentTable>;

export interface MedicineTreatmentTable {
  medicine_id: number;
  treatment_id: number;
}

export type MedicineTreatment = Selectable<MedicineTreatmentTable>;
export type NewMedicineTreatment = Insertable<MedicineTreatmentTable>;
export type MedicineTreatmentUpdate = Updateable<MedicineTreatmentTable>;

export interface IntakeTable {
  id: Generated<number>;
  start_date: Date;
  end_date: Date | null;
  frequency: string;
  medicine_id: number;
  user_id: number;
  dose_intake: string | null;
  hour: string | null;
}

export type Intake = Selectable<IntakeTable>;
export type NewIntake = Insertable<IntakeTable>;
export type IntakeUpdate = Updateable<IntakeTable>;
