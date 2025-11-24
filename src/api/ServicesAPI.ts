import z from "zod";
import api from "./axios";
import {
  ServiceCreateSchema,
  ServiceSchemaAPI,
  type Professional,
  type Service,
} from "@/types";

type ServiceForm = {
  [k: string]: FormDataEntryValue;
};

//Conversión de datos
const NumberSchema = z.coerce.number(); //String a numero
const strbool = z.stringbool(); //string a booleano

//CREAR NUEVO SERVICIO
export async function createNewService(formData: ServiceForm) {
  try {
    //console.log(formData);

    //VALIDACION DE CAMPOS MANDADOS A LA API
    const result = ServiceCreateSchema.safeParse({
      name: formData.name.toString(),
      description: formData.description.toString(),
      price: NumberSchema.parse(formData.price),
      durationMin: NumberSchema.parse(formData.durationMin),
      isActive: strbool.parse(formData.isActive),
      CategoryId: NumberSchema.parse(formData.CategoryId),
    });

    //console.log(result);
    //console.log(result.data);
    if (result.success) {
      const { data } = await api.post(
        "/app/services/create-service",
        result.data
      );

      return data.data;
    } else {
      throw new Error("Error al enviar los datos");
    }
  } catch (error) {
    console.log(error);
  }
}

export async function getAllServices() {
  try {
    const { data } = await api("/app/services");
    console.log(data);

    return data;
  } catch (error) {
    const message = "Error al obtener los servicios";
    throw new Error(message);
  }
}

export async function getServiceById(id: Service["id"]) {
  try {
    const { data } = await api(`/app/services/${id}`);
    console.log(id);
    if (!data) {
      throw new Error("Hubo un error de consulta");
    }

    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function getServiceByProfessionalId(id: Professional["id"]) {
  try {
    const { data } = await api(`/app/services/from/${id}`);

    console.log(data);

    if (!data) {
      throw new Error("Hubo un error de consulta");
    }

    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function updateService(formData: ServiceForm, id: Service["id"]) {
  try {
    console.log(formData);

    const result = ServiceSchemaAPI.safeParse({
      id,
      ServiceCreateSchema: {
        name: formData.name.toString(),
        description: formData.description.toString(),
        price: NumberSchema.parse(formData.price),
        durationMin: NumberSchema.parse(formData.durationMin),
        isActive: strbool.parse(formData.isActive),
        CategoryId: NumberSchema.parse(formData.CategoryId),
      },
    });

    console.log("result", result);
    console.log(result.data);
    if (result.success) {
      const { data } = await api.put(
        `/app/services/update-service/${id}`,
        result.data.ServiceCreateSchema
      );
      return data.data;
    } else {
      throw new Error("Error al enviar los datos");
    }
  } catch (error) {
    console.log(error);
  }
}

export async function deleteService(id: Service["id"]) {
  try {
    console.log(id);
    await api.delete(`/app/services/${id}`);
  } catch (error) {
    console.log(error);
  }
}
