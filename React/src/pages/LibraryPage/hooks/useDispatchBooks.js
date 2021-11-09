import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router-dom";
import {selectBranch, selectCategory, selectPublisher, selectSearch} from "../booksStateSlice";
import {useEffect} from "react";
import {fetchBooks} from "../booksSlice";
import {historyPush} from "../../../components/historyPush";

export function useDispatchBooks(page, rowsPerPage, filter, actualPage, actualPer) {
    const dispatch = useDispatch();
    const history = useHistory();
    const search = useSelector(selectSearch)
    const branch = useSelector(selectBranch)
    const category = useSelector(selectCategory)
    const publisher = useSelector(selectPublisher)

    useEffect(() => {
        if (filter) {
            dispatch(fetchBooks({
                page: page,
                per: rowsPerPage,
                filter: filter,
                search: search,
                branch_slug: branch,
                category: category,
                publisher: publisher
            }))
            historyPush(history, page, search, '', branch, category, publisher, rowsPerPage)
        } else if ((!isNaN(actualPage) && actualPage !== page) || actualPer !== rowsPerPage) {
            dispatch(fetchBooks({
                page: page,
                per: rowsPerPage
            }))
            historyPush(history, page, '', '', '', '', '', rowsPerPage)
        }

    }, [dispatch, page, rowsPerPage, search, branch, category, publisher, filter, history, actualPage, actualPer]);
}