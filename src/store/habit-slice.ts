import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

export interface Habit {
  id: string;
  name: string;
  frequency: "daily" | "weekly";
  completedDates: string[];
  createdAt: string;
}

interface HabitState {
  habits: Habit[];
  isLoading: boolean;
  isError: null | string;
}
const initialState: HabitState = {
  habits: [],
  isLoading: false,
  isError: null,
};

//API CALL SIMULATION
export const fetchHabits = createAsyncThunk("habits/fetchHabits", async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const mockHabits: Habit[] = [
    {
      id: "1",
      name: "Workout - 30min",
      frequency: "daily",
      completedDates: [],
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      name: "Coding - 2hrs",
      frequency: "weekly",
      completedDates: [],
      createdAt: new Date().toISOString(),
    },
    {
      id: "3",
      name: "Meditate - 10min",
      frequency: "weekly",
      completedDates: [],
      createdAt: new Date().toISOString(),
    },
  ];
  return mockHabits;
});

// Slice manages everything from states to reducers
const habitSlice = createSlice({
  //NAME OF THE STATE -> habits
  name: "habits",
  initialState,
  reducers: {
    addHabit: (
      state,
      action: PayloadAction<{ name: string; frequency: "daily" | "weekly" }>
    ) => {
      const newHabit: Habit = {
        id: Date.now().toString(),
        name: action.payload.name,
        frequency: action.payload.frequency,
        completedDates: [],
        createdAt: new Date().toISOString(),
      };
      state.habits.push(newHabit);
    },
    toggleHabit: (
      state,
      action: PayloadAction<{ id: string; date: string }>
    ) => {
      /*
       *FIND HABIT with ID
       * .find() returns the first found value
       */

      const found = state.habits.find((h) => h.id === action.payload.id);

      if (found) {
        //if that habit has date in completed dates array
        const index = found.completedDates.indexOf(action.payload.date);

        if (index > -1) {
          found.completedDates.splice(index, 1);
        } else {
          found.completedDates.push(action.payload.date);
        }
      }
    },
    deleteHabit: (state, action: PayloadAction<{ id: string }>) => {
      // state.habits = state.habits.filter((h) => h.id !== action.payload.id);FLow
      const found = state.habits.findIndex((h) => h.id === action.payload.id);

      if (found > -1) {
        state.habits.splice(found, 1);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHabits.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchHabits.fulfilled, (state, action) => {
        state.isLoading = false;
        state.habits = action.payload;
      })
      .addCase(fetchHabits.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.error.message || "Failed to fetch habits";
      });
  },
});
export const { addHabit, toggleHabit, deleteHabit } = habitSlice.actions;
export default habitSlice.reducer;
