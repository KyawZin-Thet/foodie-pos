import { CreateNewLocationOptions, LocationSlice } from "@/types/location";
import { config } from "@/utils/config";
import { Location } from "@prisma/client";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: LocationSlice = {
  items: [],
  selectedLocation: null,
  isLoading: false,
  error: null,
};

export const createNewLocation = createAsyncThunk(
  "location/createNewLocation",
  async (options: CreateNewLocationOptions, thunkApi) => {
    const { name, street, township, city, companyId, onSuccess, onError } =
      options;
    try {
      const response = await fetch(`${config.backofficeApiUrl}/location`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, street, township, city, companyId }),
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
  name: "location",
  initialState,
  reducers: {
    setLocations: (state, action: PayloadAction<Location[]>) => {
      state.items = action.payload;
      const selectedLocationId = localStorage.getItem("selectedLocationId");
      if (!selectedLocationId) {
        const firstLocationId = action.payload[0].id;
        localStorage.setItem("selectedLocationId", String(firstLocationId));
        state.selectedLocation = action.payload[0];
      } else {
        const selectedLocation = state.items.find(
          (item) => item.id === Number(selectedLocationId)
        );
        if (selectedLocation) {
          state.selectedLocation = selectedLocation;
        }
      }
    },
    setSelectedLocation: (state, action: PayloadAction<Location>) => {
      state.selectedLocation = action.payload;
    },
    addLocation: (state, action) => {
      state.items = [...state.items, action.payload];
    },
  },
});

export const { setLocations, addLocation, setSelectedLocation } =
  locationSlice.actions;
export default locationSlice.reducer;
