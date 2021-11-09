import React, {useState} from 'react';
import {useSelector} from "react-redux";
import {selectToken} from "../../LoginPage/userSlice";
import InputField from "./InputField";
import {useStoreBook} from "../actions/useStoreBook";

const today = new Date();
today.setDate(today.getDate() + 1);
const minStartDate = new Date(today).toISOString().slice(0, 10);
today.setDate(today.getDate() + 6);
const maxStartDate = new Date(today).toISOString().slice(0, 10);
today.setDate(today.getDate() + 53);
const maxEndDate = new Date(today).toISOString().slice(0, 10);

function UserFormRequest(props) {
    const {bookId, startDate, endDate, handleEndDate, handleStartDate} = props;
    const [message, setMessage] = useState('');
    const token = useSelector(selectToken);
    const [data, setData] = useState('');

    const [dateRange, setDateRange] = useState({
        minStartDate: minStartDate,
        maxStartDate: maxStartDate,
        minEndDate: minStartDate,
        maxEndDate: maxEndDate,
    }) ;

    const handleSubmit = event => {
        event.preventDefault();
        const data = {
            book_id: bookId,
            start_day: startDate,
            end_day: endDate
        };
        setData(data)
    }

    useStoreBook(token, data, setData, setMessage)

    return (
        <form onSubmit={handleSubmit}>
            <InputField
                inputName="start_day"
                range={dateRange}
                setRange={setDateRange}
                value={startDate}
                handleStartChange={handleStartDate}
                handleEndChange={handleEndDate}
            />
            <InputField
                inputName="end_day"
                range={dateRange}
                setRange={setDateRange}
                value={endDate}
                handleStartChange={handleStartDate}
                handleEndChange={handleEndDate}
            />
            <button className="defaultButton" type="submit">Send</button>
            <p>{message}</p>
        </form>
    );
}

export default UserFormRequest;