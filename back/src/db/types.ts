import { Generated, Insertable, Selectable, Updateable } from "kysely";

export interface Database {
  usuarios: Usuario;
  medicamentos: Medicamento;
  tratamientos: Tratamiento;
  medicamentos_tratamientos: MedicamentoTratamiento;
  tomas: Toma;
}

export interface UsuarioTable {
  id: Generated<number>;
  nombre: string;
  email: string;
  password: string;
  fecha_nacimiento: Date | null;
  foto: string | null;
  sexo: string | null;
}

export type Usuario = Selectable<UsuarioTable>;
export type NewUsuario = Insertable<UsuarioTable>;
export type UsuarioUpdate = Updateable<UsuarioTable>;

export interface MedicamentoTable {
  id: Generated<number>;
  pactivo: string;
  foto: string | null;
  nombre_comercial: string;
  dosis: string | null;
}

export type Medicamento = Selectable<MedicamentoTable>;
export type NewMedicamento = Insertable<MedicamentoTable>;
export type MedicamentoUpdate = Updateable<MedicamentoTable>;

export interface TratamientoTable {
  id: Generated<number>;
  nombre: string;
  id_usuario: number;
}

export type Tratamiento = Selectable<TratamientoTable>;
export type NewTratamiento = Insertable<TratamientoTable>;
export type TratamientoUpdate = Updateable<TratamientoTable>;

export interface MedicamentoTratamientoTable {
  id_medicamento: number;
  id_tratamiento: number;
}

export type MedicamentoTratamiento = Selectable<MedicamentoTratamientoTable>;
export type NewMedicamentoTratamiento = Insertable<MedicamentoTratamientoTable>;
export type MedicamentoTratamientoUpdate =
  Updateable<MedicamentoTratamientoTable>;

export interface TomaTable {
  id: Generated<number>;
  fecha_ini: Date;
  fecha_fin: Date | null;
  frecuencia: string;
  id_medicamento: number;
  id_usuario: number;
  dosis_toma: string | null;
  unidad: string | null;
  hora: string | null; // `TIME` en pg → string en JS
}

export type Toma = Selectable<TomaTable>;
export type NewToma = Insertable<TomaTable>;
export type TomaUpdate = Updateable<TomaTable>;
