import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/store/authSlice';
import rfqReducer from '../features/rfq/store/rfqSlice';
import quotationReducer from '../features/quotations/store/quotationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    rfq: rfqReducer,
    quotations: quotationReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
