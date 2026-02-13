import { createSlice } from "@reduxjs/toolkit";

const initialState = { items: [], total: 0 };
const gamesSlice = createSlice({
  name: "games",
  initialState,
  reducers: {
    list: (state, action) => {
      return { items: action.payload.items, total: action.payload.total };
    },

    addGame: (state, action) => {
      state.items.push(action.payload);
      state.total++;
    },
    
    editGame: (state, action) => {
      const game = state.items.find((game) => game.id === action.payload.id);
      if (game) {
        const {
          id,
          name,
          description,
          original_image_url,
          thumbnail_image_url,
          game_script,
        } = action.payload;
        game.name = name;
        game.id = id;
        game.description = description;
        game.original_image_url = original_image_url;
        game.thumbnail_image_url = thumbnail_image_url;
        game.game_script = game_script;
      }
    },
    
    deleteGame: (state, action) => {
      state.items = state.items.filter((game) => game.id !== action.payload);
      state.total--;
    },
  },
});

export const { list, addGame, editGame, deleteGame } = gamesSlice.actions;
export default gamesSlice.reducer;
