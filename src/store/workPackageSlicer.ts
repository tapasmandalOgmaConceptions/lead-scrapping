import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WorkPackageResponse } from '../interfaces/templateNoteInterface';

const initialState: WorkPackageResponse[] = [];

const workPackageSlice = createSlice({
  name: 'workPackage',
  initialState,
  reducers: {
    setWorkPackage: (
      state,
      action: PayloadAction<WorkPackageResponse[]>
    ) => {
      return action.payload;
    },
    resetWorkPackage: () => initialState,
  },
});

export const { setWorkPackage, resetWorkPackage } = workPackageSlice.actions;
export default workPackageSlice.reducer;
