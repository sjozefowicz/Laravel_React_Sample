import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";

export const fetchBranches = createAsyncThunk('filtration/fetchBranches', async () => {
    return await fetch('http://www.site.loc/api/branch')
        .then(response => response.json())
        .then(result => ({
            data: result.map(branch => (
                {id: branch.id, branch: branch.branch_slug}
            )),
            status: 'succeeded',
            error: null
        }))
})

export const fetchCategories = createAsyncThunk('filtration/fetchCategories', async () => {
    return await fetch('http://www.site.loc/api/category')
        .then(response => response.json())
        .then(result => ({
            data: result.map(category => (
                {id: category.id, category: category.name}
            )),
            status: 'succeeded',
            error: null
        }))
})

export const fetchPublishers = createAsyncThunk('filtration/fetchPublishers', async () => {
    return await fetch('http://www.site.loc/api/publisher')
        .then(response => response.json())
        .then(result => ({
            data: Object.values(result).map((publisher, index) => (
                {id: index, publisher: publisher}
            )),
            status: 'succeeded',
            error: null
        }))
})

export const slice = createSlice({
    name: 'filtration',
    initialState: {
        branches: {
            status: 'idle',
            error: null,
            data: []
        },
        categories: {
            status: 'idle',
            error: null,
            data: []
        },
        publishers: {
            status: 'idle',
            error: null,
            data: []
        }
    },
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchBranches.pending, (state) => {
                state.branches.status = 'loading'
            })
            .addCase(fetchBranches.fulfilled, (state, action) => {
                state.branches.status = action.payload.status
                state.branches.error = action.payload.error
                state.branches.data = action.payload.data
            })
            .addCase(fetchBranches.rejected, (state, action) => {
                state.branches.status = 'failed'
                state.branches.error = action.error.message
            })
            .addCase(fetchCategories.pending, (state) => {
                state.categories.status = 'loading'
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.categories.status = action.payload.status
                state.categories.error = action.payload.error
                state.categories.data = action.payload.data
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.categories.status = 'failed'
                state.categories.error = action.error.message
            })
            .addCase(fetchPublishers.pending, (state) => {
                state.publishers.status = 'loading'
            })
            .addCase(fetchPublishers.fulfilled, (state, action) => {
                state.publishers.status = action.payload.status
                state.publishers.error = action.payload.error
                state.publishers.data = action.payload.data
            })
            .addCase(fetchPublishers.rejected, (state, action) => {
                state.publishers.status = 'failed'
                state.publishers.error = action.error.message
            })
    }
});

export const selectBranches = state => state.filtration.branches.data;
export const selectCategories = state => state.filtration.categories.data;
export const selectPublishers = state => state.filtration.publishers.data;

export default slice.reducer;