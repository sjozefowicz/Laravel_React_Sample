import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {selectBranches, selectCategories, selectPublishers} from "./filtrationSlice";
import PublishersInput from "./PublishersInput";
import {useHistory} from "react-router-dom";
import {
    selectBranch,
    selectCategory,
    selectPublisher,
    selectSearch,
    setBranch,
    setCategory, setPublisher,
    setSearch
} from "../booksStateSlice";
import {fetchBooks} from "../booksSlice";
import {historyPush} from "../../../components/historyPush";
import {useUrlParameters} from "../../../components/urlParameters";

function Filter({setPage, setFilter}) {
    const [branches, setBranches] = useState('');
    const [categories, setCategories] = useState('');
    const [publishers, setPublishers] = useState('');
    const search = useSelector(selectSearch)
    const branch = useSelector(selectBranch)
    const category = useSelector(selectCategory)
    const publisher = useSelector(selectPublisher)
    const BranchList = useSelector(selectBranches);
    const CategoryList = useSelector(selectCategories);
    const PublisherList = useSelector(selectPublishers);
    const dispatch = useDispatch()
    const history = useHistory()
    const isBookManage = history.location.pathname.includes('books_manage')

    const searchParameter = useUrlParameters('search')
    const branchParameter = useUrlParameters('branch')
    const categoryParameter = useUrlParameters('category')
    const publisherParameter = useUrlParameters('publisher')

    useEffect(() => {
        setBranches(BranchList.map(branch => (
            <option key={branch.id} value={branch.branch}>Branch nr {branch.branch}</option>
        )))
        setCategories(CategoryList.map(category => (
            <option key={category.id} value={category.category}>{category.category}</option>
        )))
        dispatch(setSearch(searchParameter))
        dispatch(setBranch(branchParameter))
        dispatch(setCategory(categoryParameter))
        dispatch(setPublisher(publisherParameter))
        if (!isBookManage) {
            if (searchParameter === '' && branchParameter === '' && categoryParameter === '' && publisherParameter === '') {
                setFilter(false)
            } else {
                setFilter(true)
            }
        }
    }, [BranchList, CategoryList, PublisherList, searchParameter, branchParameter, categoryParameter, publisherParameter, dispatch, setFilter, isBookManage]);

    const handleSubmit = event => {
        event.preventDefault();
        if (search === '' && branch === '' && category === '' && publisher === '') {
            setFilter(false)
            dispatch(fetchBooks({
                page: 1,
                per: 25
            }))
            historyPush(history, 1)
        } else {
            setPage(1)
            setFilter(true)
        }
    }

    const handleChange = (event) => {
        const value = event.target.value;
        const name = event.target.name;
        switch (name) {
            case 'search':
                dispatch(setSearch(value));
                if (!isBookManage) {
                    setFilter(false)
                }
                break;
            case 'branch':
                dispatch(setBranch(value));
                setFilter(false)
                break;
            case 'category':
                dispatch(setCategory(value));
                setFilter(false)
                break;
            default: return null;
        }
    }

    return (
        <div className="filtration">
            <form onSubmit={handleSubmit}>
                <label htmlFor="search">Search
                    <input type="text" id="search" name="search" value={search} onChange={handleChange}/>
                </label>
                {(!isBookManage)
                    ?
                    <>
                        <label htmlFor="branch">Branch
                        <select name="branch" id="branch" value={branch} onChange={handleChange}>
                            <option value="">-</option>
                            {branches}
                        </select>
                        </label>
                        <label htmlFor="category">Category
                            <select name="category" id="category" value={category} onChange={handleChange}>
                                <option value="">-</option>
                                {categories}
                            </select>
                        </label>
                        <PublishersInput
                        publishers={publishers}
                        setPublishers={setPublishers}
                        setFilter={setFilter}
                        PublisherList={PublisherList}
                        />
                        <button className="defaultButton" type="submit">Show results</button>
                    </>
                    : null
                }

            </form>
        </div>
    );
}

export default React.memo(Filter);