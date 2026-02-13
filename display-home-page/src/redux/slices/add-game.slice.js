import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  name: '',
  description: '',
  original_image_url: '',
  thumbnail_image_url: '',
  game_script: {
    level: 1,
    score: 100,
  },
};

const addGameSlice = createSlice({
  name: 'addGame',
  initialState,
  reducers: {
    formValues: (state, action) => {
      const { field, key, value } = action.payload;
      if (key) {
        state[field][key] = value;
      } else {
        state[field] = value;
      }
    },
    
    resetForm: (state) => initialState,
    setGame: (state, action) => {
      const { name, description, original_image_url, thumbnail_image_url, gameObject } = action.payload;
      state.name = name;
      state.description = description;
      state.original_image_url = original_image_url;
      state.thumbnail_image_url = thumbnail_image_url;
      state.game_script = gameObject;
    },
  },
});

export const { formValues, resetForm, setGame } = addGameSlice.actions;
export default addGameSlice.reducer;
