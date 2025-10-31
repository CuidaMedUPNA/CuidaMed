import {
  ColumnType,
  Generated,
  Insertable,
  Selectable,
  Updateable,
} from "kysely";

export interface Database {
  user: UserTable;
  medicine: MedicineTable;
  treatment: TreatmentTable;
  medicine_ingredient: MedicineIngredientTable;
  dosing_schedule: DosingScheduleTable;
  dosing_time: DosingTimeTable;
}

export interface UserTable {
  id: Generated<number>;
  name: string;
  email: string;
  password: string;
  birthdate: string | null;
  profile_picture: string | null;
  gender: string | null;
}

export type User = Selectable<UserTable>;
export type NewUser = Insertable<UserTable>;
export type UserUpdate = Updateable<UserTable>;

export interface MedicineTable {
  id: Generated<number>;
  trade_name: string;
  picture: string | null;
}

export type Medicine = Selectable<MedicineTable>;
export type NewMedicine = Insertable<MedicineTable>;
export type MedicineUpdate = Updateable<MedicineTable>;

export interface TreatmentTable {
  id: Generated<number>;
  name: string;
  user_id: number;
  start_date: ColumnType<Date, string, never>;
  end_date: ColumnType<Date | null, string | null, never>;
}

export type Treatment = Selectable<TreatmentTable>;
export type NewTreatment = Insertable<TreatmentTable>;
export type TreatmentUpdate = Updateable<TreatmentTable>;

export interface MedicineIngredientTable {
  id: Generated<number>;
  medicine_id: number;
  ingredient_name: string;
  concentration_amount: number;
  concentration_unit: string;
}

export type MedicineIngredient = Selectable<MedicineIngredientTable>;
export type NewMedicineIngredient = Insertable<MedicineIngredientTable>;
export type MedicineIngredientUpdate = Updateable<MedicineIngredientTable>;

export interface DosingScheduleTable {
  id: Generated<number>;
  medicine_id: number;
  treatment_id: number;
  start_date: ColumnType<Date, string, never>;
  end_date: ColumnType<Date | null, string | null, never>;
  dose_amount: number;
  dose_unit: string;
}
export type DosingSchedule = Selectable<DosingScheduleTable>;
export type NewDosingSchedule = Insertable<DosingScheduleTable>;
export type DosingScheduleUpdate = Updateable<DosingScheduleTable>;

export interface DosingTimeTable {
  id: Generated<number>;
  dosing_schedule_id: number;
  scheduled_time: string;
  day_of_week: 1 | 2 | 3 | 4 | 5 | 6 | 7 | null;
}
export type DosingTime = Selectable<DosingTimeTable>;
export type NewDosingTime = Insertable<DosingTimeTable>;
export type DosingTimeUpdate = Updateable<DosingTimeTable>;
