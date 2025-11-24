import { create, type StateCreator } from "zustand";
import { persist } from "zustand/middleware";

type State = {
  token: string;
  profile: any;
  isAuth: boolean;
};
type Actions = {
  setToken: (value: string) => void;
  setProfile: (value: any) => void;
  setIsAuth: () => void;
  logout: () => void;
};

const storeAPI: StateCreator<State & Actions> = (set) => ({
  token: "",
  profile: null,
  isAuth: false,

  setToken: (value: string) =>
    set(() => ({
      token: value,
    })),

  setProfile: (value: any) =>
    set(() => ({
      profile: value,
    })),

  setIsAuth: () =>
    set(() => ({
      isAuth: true,
    })),

  logout: () => {
    set(() => ({
      token: "",
      isAuth: false,
      profile: "",
    }));

    localStorage.removeItem("auth");
    useAuthStore.persist.clearStorage();
  },
});

export const useAuthStore = create<State & Actions>()(
  persist(storeAPI, { name: "auth" })
);
