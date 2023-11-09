import { CreateNewLocationOptions, LocationSlice } from "@/types/location";
import { config } from "@/utils/config";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState: LocationSlice = {
  items: [],
  isLoading: false,
  error: null,
};

export const createNewLocation = createAsyncThunk(
  "location/createNewLocation",
  async (options: CreateNewLocationOptions, thunkApi) => {
    const { name, address, onError, onSuccess } = options;
    try {
      const response = await fetch(`${config.apiBaseUrl}/location`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, address }),
      });
      const createdLocation = await response.json();
      thunkApi.dispatch(addLocation(createdLocation));
      onSuccess && onSuccess();
    } catch (err) {
      onError && onError();
    }
  }
);

const locationSlice = createSlice({
  name: "Location",
  initialState,
  reducers: {
    setLocations: (state, action) => {
      state.items = action.payload;
    },
    addLocation: (state, action) => {
      state.items = [...state.items, action.payload];
    },
  },
});

export const { setLocations, addLocation } = locationSlice.actions;
export default locationSlice.reducer;
