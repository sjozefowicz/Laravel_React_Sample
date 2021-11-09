import React, {useRef, useState} from 'react';
import {useOutsideWrapper} from "../hooks/useOutsideWrapper";
import {useDispatch, useSelector} from "react-redux";
import {selectPublisher, setPublisher} from "../booksStateSlice";

function PublishersInput({publishers, setPublishers, setFilter, PublisherList}) {
    const [publisherInputActive, setPublisherInputActive] = useState(false)
    const publisher = useSelector(selectPublisher)
    const dispatch = useDispatch()

    const publisherListWrapper = useRef();

    const handlePublisherChoose = event => {
        setFilter(false)
        dispatch(setPublisher(event.target.textContent))
        publisherListWrapper.current.classList.remove('publishersListActive')
        setPublisherInputActive(true)
    }
    useOutsideWrapper(publisherListWrapper)

    const handleChange = (event) => {
        const value = event.target.value;
        setPublisherInputActive(false);
        if (value.length >= 3) {
            setPublishers(PublisherList.map(publisher => {
                if (publisher.publisher.toLowerCase().includes(value.toLowerCase())) {
                    return <p key={publisher.id} onClick={handlePublisherChoose}>{publisher.publisher}</p>
                }
                return false;
            }))
            publisherListWrapper.current.classList.add('publishersListActive');
        } else {
            setPublishers('')
            publisherListWrapper.current.classList.remove('publishersListActive');
        }
        setFilter(false)
        dispatch(setPublisher(value));
    }

    const handleClick = event => {
        if (event.target.value.length >= 3 && !publisherInputActive) {
            publisherListWrapper.current.classList.add('publishersListActive');
        }
    }


    return (
        <label htmlFor="publisher">Publisher
            <div className="publisherWrapper">
                <input
                    type="text"
                    id="publisher"
                    name="publisher"
                    value={publisher}
                    onChange={handleChange}
                    onClick={handleClick}
                />
                <div className="publishersList" ref={publisherListWrapper}>
                    {publishers}
                </div>
            </div>
        </label>
    );
}

export default PublishersInput;