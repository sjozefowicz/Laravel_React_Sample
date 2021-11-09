import {createSlice} from "@reduxjs/toolkit";

export const slice = createSlice({
    name: 'booksState',
    initialState: {
        search: '',
        branch: '',
        category: '',
        publisher: ''
    },
    reducers: {
        setSearch: (state, action) => {
            state.search = action.payload;
        },
        setBranch: (state, action) => {
            state.branch = action.payload;
        },
        setCategory: (state, action) => {
            state.category = action.payload;
        },
        setPublisher: (state, action) => {
            state.publisher = action.payload;
        },
    }
});

export const {setSearch, setBranch, setCategory, setPublisher} = slice.actions;

export const selectSearch = state => state.booksState.search
export const selectBranch = state => state.booksState.branch
export const selectCategory = state => state.booksState.category
export const selectPublisher = state => state.booksState.publisher

export default slice.reducer;