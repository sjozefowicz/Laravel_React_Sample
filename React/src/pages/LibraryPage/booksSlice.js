import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";

export const fetchBooks = createAsyncThunk('books/fetchBooks', (parameters) => {
    let url = 'http://www.site.loc/api/book'
    const pageAndPer = `page=${parameters.page}&per=${parameters.per}`
    if (parameters.filter === true) {
        url += `/filter?search=${parameters.search}\n
        &filter[branch_slug]=${parameters.branch_slug}\n
        &filter[category]=${parameters.category}\n
        &filter[publisher]=${parameters.publisher}\n
        &${pageAndPer}`
    } else {
        url += '?' + pageAndPer
    }
    return fetch(url)
        .then(response => response.json())
        .then(result => {
            if (result.error) {
                return {
                    error: result.error,
                    status: 'failed'
                }
            } else {
                return {
                    status: 'succeeded',
                    error: null,
                    data: result,
                    books: result.data
                }
            }
        })
})

export const slice = createSlice({
    name: 'books',
    initialState: {
        status: 'idle',
        error: null,
        data: '',
        books: []
    },
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchBooks.pending, state => {
                state.status = 'loading'
            })
            .addCase(fetchBooks.fulfilled, (state, action) => {
                state.status = action.payload.status
                state.error = action.payload.error
                state.data = action.payload.data
                state.books = action.payload.books
            })
            .addCase(fetchBooks.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error
            })
    }
});

export const selectBooks = state => state.books.books
export const selectBooksData = state => state.books.data

export default slice.reducer;