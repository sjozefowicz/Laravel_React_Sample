import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";

export const fetchBook = createAsyncThunk('singleBook/fetchBook', (id) =>
    fetch('http://www.site.loc/api/book/show/' + id)
        .then(response => {
            if(response.ok === true) {
                return response.json()
            } else {
                throw Error(response.status)
            }
        })
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
                    book: result
                }
            }
        })
        .catch(error => console.warn(error))
)

export const fetchBookUpdate = createAsyncThunk('singleBook/fetchBookUpdate', (data) =>
    fetch('http://www.site.loc/api/book/update/' + data.book.id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + data.authToken
        },
        body: JSON.stringify({
            id: data.book.id,
            title: data.book.title,
            language: data.book.language,
            description: data.book.description,
            publication_date: data.book.publication_date,
            publisher: data.book.publisher,
            pages_num: data.book.pages_num,
            branch_slug: data.book.branch_slug,
        }),
    })
        .then(response => response.json())
        .then(result => {
            console.log(result)
            if (result.error) {
                return {
                    error: result.error,
                    status: 'failed'
                }
            } else {
                return {
                    status: 'succeeded',
                    error: null
                }
            }
        })
)

export const slice = createSlice({
    name: 'singleBook',
    initialState: {
        status: 'idle',
        error: null,
        book: []
    },
    reducers: {
        updateBook: (state, action) => {
            state.book = action.payload.book
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchBook.pending, state => {
                state.status = 'loading'
            })
            .addCase(fetchBook.fulfilled, (state, action) => {
                state.status = action.payload.status
                state.error = action.payload.error
                state.book = action.payload.book
            })
            .addCase(fetchBook.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error
            })
            .addCase(fetchBookUpdate.pending, state => {
                state.status = 'loading'
            })
            .addCase(fetchBookUpdate.fulfilled, (state, action) => {
                state.status = action.payload.status
                state.error = action.payload.error
            })
            .addCase(fetchBookUpdate.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error
            })
    }
});

export const {updateBook} = slice.actions;

export const selectSingleBook = state => state.singleBook.book

export default slice.reducer;