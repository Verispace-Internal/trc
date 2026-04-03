import { configureStore } from "@reduxjs/toolkit";
import adminSlice from "./reducers/authSlice";
import companySlice from "./reducers/companySlice"
import blogsSlice from "./reducers/blogsSlice"
import joinCommunitySlice from "./reducers/joinCommunitySlice"
import testimonialSlice from "./reducers/testimonialSlice"


export const store = configureStore({
    reducer:{
        authReducer: adminSlice,
            companyReducer: companySlice,
                blogsReducer: blogsSlice,
    joinCommunityReducer: joinCommunitySlice,
    testimonialReducer: testimonialSlice,

    },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch =typeof store.dispatch;