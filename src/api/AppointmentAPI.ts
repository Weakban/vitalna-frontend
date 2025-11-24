import api from "./axios";

export const getAvailableSlots = async (serviceId: number, date: Date) => {
  try {
    const { data } = await api.get<string[]>(
      `/services/${serviceId}/availability`,
      {
        params: {
          date: date.toISOString(), // Envía la fecha como string ISO
        },
      }
    );
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

//CREAR CITA
export async function createNewAppointment(
  serviceId: number,
  appointmentData: {
    date: string; // Formato YYYY-MM-DD
    startTime: string; // Formato HH:MM
    notes?: string;
  }
) {
  try {
    console.log("Creando cita con datos:", { serviceId, ...appointmentData });
    const { data } = await api.post(
      `/app/appointments/create-appointment/${serviceId}`,
      appointmentData
    );

    return data;
  } catch (error) {
    console.error("Error al crear la cita:", error);
    throw error;
  }
}

//OBTENER CITAS PARA CLIENTE
export async function getClientAppointments() {
  try {
    const { data } = await api("/app/appointments/client");
    console.log("Citas del cliente:", data);
    return data;
  } catch (error) {
    const message = "Error al obtener las citas del cliente";
    throw new Error(message);
  }
}

//OBTENER CITAS PARA PROFESIONAL
export async function getProfessionalAppointments(professionalId: number) {
  try {
    const { data } = await api(
      `/app/appointments/professional/${professionalId}`
    );
    console.log("Citas del profesional:", data);
    return data;
  } catch (error) {
    const message = "Error al obtener las citas del profesional";
    throw new Error(message);
  }
}

//OBTENER TODAS LAS CITAS (ADMIN)
export async function getAllAppointments() {
  try {
    const { data } = await api("/app/appointments");
    console.log(data);
    return data;
  } catch (error) {
    const message = "Error al obtener las citas";
    throw new Error(message);
  }
}

/*
export async function getAppointmentById(id: Appointment["id"]) {
  try {
    const { data } = await api(`/app/Appointments/${id}`);

    console.log(id);
    if (!data) {
      throw new Error("Hubo un error de consulta");
    }

    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function updateAppointment(
,
  id: Appointment["id"]
) {
  try {
    

  } catch (error) {
    console.log(error);
  }
}

export async function deleteAppointment(id: Appointment["id"]) {
  try {
    console.log(id);
    await api.delete(`/app/Appointments/${id}`);
  } catch (error) {
    console.log(error);
  }
}
*/
