import { CompanySlice, UpdateCompanyOptions } from "@/types/company";
import { config } from "@/utils/config";
import { Company } from "@prisma/client";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: CompanySlice = {
  item: null,
  isLoading: false,
  error: null,
};

export const updateCompany = createAsyncThunk(
  "company/updateCompany",
  async (options: UpdateCompanyOptions, thunkApi) => {
    const { id, name, street, township, city, onSuccess, onError } = options;
    try {
      const response = await fetch(`${config.backofficeApiUrl}/company`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id, name, street, township, city }),
      });
      const { company } = await response.json();
      thunkApi.dispatch(setCompany(company));
      onSuccess && onSuccess();
    } catch (err) {
      onError && onError();
    }
  }
);

const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {
    setCompany: (state, action: PayloadAction<Company>) => {
      state.item = action.payload;
    },
  },
});

export const { setCompany } = companySlice.actions;
export default companySlice.reducer;
