import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import userReducer from './userSlice';
import sectionStatusReducer from './templateNoteSectionStatusSlice';
import workPackageReducer from "./workPackageSlicer";

const rootReducer = combineReducers({
  user: userReducer,
  templateNoteSectionStatus: sectionStatusReducer,
  workPackage: workPackageReducer
});

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['user'],
  blacklist: ['templateNoteSectionStatus', 'workPackage'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

// Define RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;