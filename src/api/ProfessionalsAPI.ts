import type { Professional, OdooLead } from "@/types";
import api from "./axios";

export const getAvailableSlots = async (serviceId: number, date: Date) => {
  try {
    const { data } = await api.get<string[]>(
      `/app/professionals/${serviceId}/availability`,
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

export async function getAllProfessionals() {
  try {
    const { data } = await api("/app/professionals");
    console.log(data);

    return data;
  } catch (error) {
    const message = "Error al obtener los profesionales";
    throw new Error(message);
  }
}

export async function getProfessionalById(id: Professional["id"]) {
  try {
    const { data } = await api(`/app/professionals/${id}`);
    console.log(data);

    return data;
  } catch (error) {
    const message = "Error al obtener el profesional";
    throw new Error(message);
  }
}

export async function getMyLeads() {
  try {
    const { data } = await api.get<OdooLead[]>("/odoo/my-leads");
    return data;
  } catch (error) {
    console.error(error);
    return []; // Devuelve un array vacío en caso de error
  }
}
