import { Dispatch, SetStateAction } from "react";
import { create } from "zustand";

interface UseGetStoreProps {
  isAdd: boolean;
  setIsAdd: (value: boolean) => void;
}

export const useAddStore = create<UseGetStoreProps>((set, get) => ({
  isAdd: false,
  setIsAdd: (value: boolean) => set({ isAdd: value }),
}));
