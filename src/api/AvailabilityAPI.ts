// src/api/AvailabilityAPI.ts
import api from "./axios";
import type {
  WeeklyDaySchedule,
  ExceptionDate,
  WeeklyAvailabilityRecord,
} from "@/types"; // Ajusta la ruta a tus tipos

// --- HORARIO SEMANAL ---

/**
 * Obtiene el horario semanal del profesional autenticado.
 */
export async function getWeeklySchedule(
  sendData: string
): Promise<WeeklyAvailabilityRecord[]> {
  try {
    const { data } = await api.get("/app/availability/weekly", {
      headers: {
        Authorization: `Bearer ${sendData}`,
      },
    });
    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Error al obtener el horario semanal.");
  }
}

/**
 * Sobrescribe el horario semanal completo del profesional.
 */
export async function updateWeeklySchedule(
  sendData: string,
  scheduleData: WeeklyDaySchedule[]
): Promise<{ message: string }> {
  try {
    const { data } = await api.post("/app/availability/weekly", scheduleData, {
      headers: {
        Authorization: `Bearer ${sendData}`,
      },
    });
    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Error al actualizar el horario semanal.");
  }
}

// --- EXCEPCIONES ---

/**
 * Obtiene todas las excepciones del profesional autenticado.
 */
export async function getExceptions(token: string): Promise<ExceptionDate[]> {
  try {
    const { data } = await api.get("/app/availability/exceptions", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Error al obtener las excepciones.");
  }
}

/**
 * Añade una nueva excepción para el profesional.
 */
export async function addException(
  token: string,
  exceptionData: Omit<ExceptionDate, "id">
): Promise<ExceptionDate> {
  try {
    const { data } = await api.post(
      "/app/availability/exceptions",
      exceptionData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data; // Devuelve la excepción creada (con su nuevo ID)
  } catch (error) {
    console.error(error);
    throw new Error("Error al añadir la excepción.");
  }
}

/**
 * Elimina una excepción por su ID.
 */
export async function deleteException(
  token: string,
  exceptionId: number
): Promise<{ message: string }> {
  try {
    const { data } = await api.delete(
      `/app/availability/exceptions/${exceptionId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Error al eliminar la excepción.");
  }
}

// --- FUNCIONES PARA CONSULTAR DISPONIBILIDAD DE OTROS PROFESIONALES ---

/**
 * Obtiene el horario semanal de un profesional específico (público).
 * Para ser usado por clientes que quieren ver la disponibilidad.
 */
export async function getProfessionalWeeklySchedule(
  professionalId: number,
  token: string
): Promise<WeeklyAvailabilityRecord[]> {
  try {
    const { data } = await api.get(
      `/app/availability/professional/${professionalId}/weekly`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Error al obtener el horario del profesional.");
  }
}

/**
 * Obtiene las excepciones de disponibilidad de un profesional específico (público).
 * Para ser usado por clientes que quieren ver las fechas no disponibles.
 */
export async function getProfessionalExceptions(
  professionalId: number,
  token: string
): Promise<ExceptionDate[]> {
  try {
    const { data } = await api.get(
      `/app/availability/professional/${professionalId}/exceptions`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Error al obtener las excepciones del profesional.");
  }
}

/**
 * Obtiene los horarios disponibles para un profesional en una fecha específica.
 * Combina horario semanal, excepciones y citas ya agendadas.
 */
export async function getAvailableTimesForDate(
  professionalId: number,
  date: string, // Formato YYYY-MM-DD
  token: string
): Promise<string[]> {
  try {
    const url = `/app/availability/professional/${professionalId}/times`;
    console.log("🌐 Making API request to:", url);
    console.log("📅 With date param:", date);
    console.log(
      "🔑 With token:",
      token ? token.substring(0, 20) + "..." : "null"
    );

    const config = {
      params: { date },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    console.log("⚙️ Request config:", config);

    const response = await api.get(url, config);
    console.log("✅ API Response received:", response);
    console.log("📊 Response data:", response.data);
    console.log("📈 Response status:", response.status);

    return response.data;
  } catch (error: any) {
    console.error("💥 API Error:", error);
    console.error("📋 Error response:", error.response?.data);
    console.error("📊 Error status:", error.response?.status);
    console.error("📝 Error message:", error.message);
    throw new Error("Error al obtener los horarios disponibles.");
  }
}
