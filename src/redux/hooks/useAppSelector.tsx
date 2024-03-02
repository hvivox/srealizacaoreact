import { RootState } from '../store';
import { TypedUseSelectorHook, useSelector } from "react-redux";

// criação do hook
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;