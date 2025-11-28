import { emailOnlySchema, loginSchema, TokenConfirmSchema } from "@/types";
import api from "./axios";
import { isAxiosError } from "axios";
type UserData = {
  [k: string]: FormDataEntryValue;
};

async function setProfessional(formData: UserData) {
  //console.log("desde setProfesional", formData);
  const { data } = await api.post("/app/auth/set-professional", formData);
  return data;
}
async function setClient(formData: UserData) {
  //console.log("desde setClient", formData);
  const { data } = await api.post("/app/auth/set-client", formData);
  return data;
}

//UserData si es con action y UserFormAction si es con RHF
export async function createAccount(formData: UserData /*UserFormData */) {
  try {
    //console.log("la informacion recibida en la api es:", formData);
    const { data } = await api.post("/app/auth/create-account", formData);
    //console.log(data);

    if (formData.role === "PROFESSIONAL") {
      const data1 = await setProfessional(formData);
      return [data, data1];
    }

    if (formData.role === "CLIENT") {
      const data1 = await setClient(formData);
      return [data, data1];
    }

    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
    throw error instanceof Error ? error : new Error("Error desconocido");
  }
}

export async function confirmAccount(formData: UserData) {
  try {
    const result = TokenConfirmSchema.safeParse(formData);
    //console.log("result", result);
    //console.log(result.data);
    if (result.success) {
      const { data } = await api.post("/app/auth/confirm-account", result.data);
      //console.log(data);
      return data.data;
    } else {
      throw new Error("Error al enviar los datos");
    }
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export async function login(formData: UserData /*UserFormData */) {
  try {
    const result = loginSchema.safeParse(formData);

    if (result.success) {
      //console.log(result.data);
      const { data } = await api.post("/app/auth/login", result.data);

      //console.log(data);

      return data;
    } else {
      //console.log(result.error.message);
      throw new Error(result.error.message);
    }
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
    throw error instanceof Error ? error : new Error("Error desconocido");
  }
}

export async function newToken(formData: UserData /*UserFormData */) {
  try {
    const result = emailOnlySchema.safeParse(formData);

    if (result.success) {
      //console.log(result.data);
      const { data } = await api.post("/app/auth/request-code", result.data);

      return data.data;
    } else {
      throw new Error(result.error.message);
    }
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
    throw error instanceof Error ? error : new Error("Error desconocido");
  }
}

export async function getProfileData(sendData: string) {
  try {
    const { data } = await api("/app/auth/get-profile", {
      headers: {
        Authorization: `Bearer ${sendData}`,
      },
    });
    return data;
  } catch (error) {
    const message = "Error al obtener informacion de usuario";
    throw new Error(message);
  }
}

export async function forgotPassword(formData: UserData) {
  try {
    const result = emailOnlySchema.safeParse(formData);
    if (result.success) {
      const { data } = await api.post("/app/auth/forgot-password", result.data);
      return data;
    } else {
      throw new Error(result.error.message);
    }
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
    throw error instanceof Error ? error : new Error("Error desconocido");
  }
}

export async function validatePasswordResetToken(formData: UserData) {
  try {
    const result = TokenConfirmSchema.safeParse(formData);
    if (result.success) {
      const { data } = await api.post("/app/auth/validate-token", result.data);
      return data;
    } else {
      throw new Error(result.error.message);
    }
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
    throw error instanceof Error ? error : new Error("Error desconocido");
  }
}

export async function resetPassword(formData: UserData) {
  try {
    const { data } = await api.post("/app/auth/reset-password", formData);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
    throw error instanceof Error ? error : new Error("Error desconocido");
  }
}
