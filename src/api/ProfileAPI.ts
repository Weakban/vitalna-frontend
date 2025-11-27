import api from "./axios";

type UpdateProfileData = {
  name?: string;
  phone?: string;
  birthDate?: string;
  gender?: string;
  bio?: string;
  specialty?: string;
  available?: boolean;
};

type ChangePasswordData = {
  currentPassword: string;
  newPassword: string;
};

export async function updateProfile(formData: UpdateProfileData) {
  try {
    const { data } = await api.put("/app/auth/update-profile", formData);
    return data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error al actualizar el perfil"
    );
  }
}

export async function changePassword(formData: ChangePasswordData) {
  try {
    const { data } = await api.put("/app/auth/change-password", formData);
    return data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error al cambiar la contraseña"
    );
  }
}
