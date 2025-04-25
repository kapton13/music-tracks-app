// hooks.ts
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from '../app/store';

// Підправлений useDispatch, який знає про Thunk
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Так само типізований useSelector (опційно)
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;