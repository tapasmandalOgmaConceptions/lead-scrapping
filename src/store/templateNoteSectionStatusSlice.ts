import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { templateNoteStatus } from '../interfaces/templateNoteInterface';

const initialState: templateNoteStatus = {
  deal: false,
  workPackage: false,
  technicalContext: false,
  communication: false,
  internalNote: false,
};

const sectionSlice = createSlice({
  name: 'templateNoteSectionStatus',
  initialState,
  reducers: {
    setSectionStatus: (
      state,
      action: PayloadAction<keyof templateNoteStatus>
    ) => {
      state[action.payload] = true;
    },
    resetSectionStatus: () => initialState,
  },
});

export const { setSectionStatus, resetSectionStatus } = sectionSlice.actions;
export default sectionSlice.reducer;
