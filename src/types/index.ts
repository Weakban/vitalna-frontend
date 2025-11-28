import { z } from "zod";

/** USUARIOS */
const RoleEnum = z.enum(["CLIENT", "PROFESSIONAL"]);
export const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().trim().toLowerCase(),
  password: z.string(),
  password_confirmation: z.string(),
  role: RoleEnum,

  phone: z.string().optional(),
  bio: z.string().optional(),
  specialty: z.string().optional(),
  userId: z.number().optional(),

  birthDate: z.string().optional(),
  gender: z.string().optional(),
});
//creamos type de usuarios
export type UserT = z.infer<typeof userSchema>;
//generamos types unicamente con los campos elegidos

//se genera un esquema a partir de otro esquema
export const loginSchema = userSchema.pick({ email: true, password: true });

export const emailOnlySchema = z.object({
  email: z.string().trim().toLowerCase().email("Correo electrónico inválido"),
});

export type emailOnlyForm = z.infer<typeof emailOnlySchema>;

//se crea un type a partir de un esquema
export type LoginFormData = Pick<UserT, "email" | "password">;

export type NewTokenData = Pick<UserT, "email">;

export type RegisterFormData = Pick<
  UserT,
  | "name"
  | "email"
  | "password"
  | "password_confirmation"
  | "role"
  | "phone"
  | "bio"
  | "specialty"
  | "birthDate"
  | "gender"
>;

export const TokenConfirmSchema = z.object({
  token: z
    .union([z.string(), z.instanceof(File)])
    .refine((v) => typeof v === "string", "Token debe ser string")
    .transform((v) => Number((v as string).replace(/,/g, "")))
    .refine((n) => Number.isFinite(n), "Token inválido"),
});

/**SERVICIOS */
//const CategoryEnum = z.enum(["HEALTH", "BEAUTY"]);

/** SUB-ESQUEMAS DE  ESQUEMA SERVICIOS y sus types derivados*/
export const CategorySchema = z.object({
  id: z.number(),
  name: z.string(), // p.ej. "HEALTH"
});
export type Category = z.infer<typeof CategorySchema>;

export const ProviderUserSchema = z.object({
  name: z.string(),
});
export type ProviderUser = z.infer<typeof ProviderUserSchema>;

export const ProviderSchema = z.object({
  id: z.number(),
  specialty: z.string(),
  user: ProviderUserSchema,
});

export type Provider = z.infer<typeof ProviderSchema>;

/** ESQUEMA COMPLETO DE SERVICIO  */
export const ServiceSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  price: z.number(), //
  durationMin: z.int(),
  isActive: z.boolean(),
  CategoryId: z.number(),
  category: CategorySchema, //campo de relacion categoria
  provider: ProviderSchema, //campo de relacion provedor
});

//se genera un esquema a partir de otro esquema
export const ServiceCreateSchema = ServiceSchema.pick({
  name: true,
  description: true,
  price: true,
  durationMin: true,
  isActive: true,
  CategoryId: true,
});

/*crear
export const ServiceCreateSchema = z.object({
  name: z.string(),
  description: z.string(),
  price: z.number(),
  durationMin: z.int(),
  isActive: z.boolean(),
  CategoryId: z.number(),
});*/

export type Service = z.infer<typeof ServiceSchema>;

/** Respuesta completa: array de servicios */
export const ServicesResponseSchema = z.array(ServiceSchema);
export type ServicesResponse = z.infer<typeof ServicesResponseSchema>;

//validacion de campos al crear servicios
export type serviceFormData = Pick<
  Service,
  "name" | "description" | "price" | "durationMin" | "CategoryId" | "isActive"
>;

/**    VALIDACION EN API CREATE SERVICE    */
//Para la validcion no podemos incluir  los campos de relacion asi que se crean esquemas sin ellos

//Nota: cambiar por pick: export const ServiceCreateSchema = ServiceSchema.pick({ name: true, description: true... });
//ver en: 586

//actualizar
export const ServiceSchemaAPI = z.object({
  id: z.number(),
  ServiceCreateSchema,
});

export const ProfessionalUserSchema = z.object({
  email: z.string(),
  name: z.string(), // p.ej. "HEALTH"
});
export type ProfessionalUser = z.infer<typeof ProfessionalUserSchema>;

/*PROFESIONALES */
export const ProfessionalSchema = z.object({
  user: ProfessionalUserSchema, //campo de relacion categoria
  id: z.number(),
  bio: z.string(),
  specialty: z.string(),
  phone: z.number(), //
  profileImage: z.int(),
  isActive: z.boolean(),
});
export type Professional = z.infer<typeof ProfessionalSchema>;
//export type ProfessionalInfo = Pick<Professional, "id" | "services"|>;

/*Leads*/
export type Id = string | number;

export interface LeadCardData {
  id: Id;
  columnId: Id;
  content: string;
  clientName: string;
  service: string;
}

export interface LeadColumnData {
  id: Id;
  title: string;
}

/*   APPOINTMENTS */

const StatusEnum = z.enum(["INTERESTED", "RESERVED", "COMPLETED", "CANCELLED"]);
export const AppointmentSchema = z.object({
  id: z.number(),
  appointmentDate: z.string(), // Fecha y hora de la cita
  duration: z.number(), // Duración en minutos
  status: StatusEnum,
  notes: z.string().optional(),
  createdAt: z.string(), // Cuándo se creó el registro
  updatedAt: z.string(), // Última actualización
  clientId: z.number(),
  professionalId: z.number(),
  serviceId: z.number(),
  odooLeadId: z.number().optional(),
  // Relaciones
  client: z
    .object({
      id: z.number(),
      user: z
        .object({
          name: z.string(),
          email: z.string(),
        })
        .optional(),
    })
    .optional(),
  professional: z
    .object({
      id: z.number(),
      user: z
        .object({
          name: z.string(),
          email: z.string(),
        })
        .optional(),
    })
    .optional(),
  service: z
    .object({
      id: z.number(),
      name: z.string(),
      description: z.string(),
      price: z.number(),
      durationMin: z.number(),
    })
    .optional(),
});

//creamos type de usuarios
export type Appointment = z.infer<typeof AppointmentSchema>;
//generamos types unicamente con los campos elegidos

//se genera un esquema a partir de otro esquema
//export const appoint = appointmentSchema.pick({ email: true, password: true });

//se crea un type a partir de un esquema
export type appointmentData = Pick<Appointment, "serviceId">;

// VITALNA_BACKEND/src/api/ProfessionalsAPI.ts
//Interface para los leads obtenidos de Odoo
export interface OdooLead {
  id: number;
  name: string;
  partner_id: [number, string]; // [ID, "Nombre Cliente"]
  stage_id: [number, string]; // [ID, "Nombre Etapa"]
}

//Availability types

export interface TimeBlock {
  id?: number;
  startTime: string;
  endTime: string;
}
export interface WeeklyDaySchedule {
  dayOfWeek: number;
  dayName: string;
  isAvailable: boolean;
  blocks: TimeBlock[];
}
export interface ExceptionDate {
  id?: number;
  date: string;
  isAvailable: boolean;
  startTime?: string;
  endTime?: string;
}

// --- NUEVO: Define los tipos que REALMENTE devuelve la BBDD ---
export interface WeeklyAvailabilityRecord {
  id: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  professionalId: number;
}

// (ExceptionDate ya está bien definido, pero lo renombramos para claridad)
export interface ExceptionRecord {
  id: number;
  date: string; // "YYYY-MM-DD"
  isAvailable: boolean;
  startTime?: string;
  endTime?: string;
  professionalId: number;
}
