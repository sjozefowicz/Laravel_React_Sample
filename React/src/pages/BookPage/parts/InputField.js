import React from 'react';

function InputField({inputName, range, setRange, value, handleStartChange ,handleEndChange}) {

    const handleEndDatesRange = (newMinEndDate, newMaxEndDate) => {
        setRange({
            minStartDate: range.minStartDate,
            maxStartDate: range.maxStartDate,
            minEndDate: newMinEndDate,
            maxEndDate: newMaxEndDate,
        })
    }

    const handleStartDateChange = event => {
        const startDate = event.target.value;
        const date = new Date(startDate);
        const minEndDate = new Date(date).toISOString().slice(0, 10);
        date.setDate(date.getDate() + 60);
        const maxEndDate = new Date(date).toISOString().slice(0, 10);
        handleEndDatesRange(minEndDate, maxEndDate);
        handleStartChange(startDate);
        handleEndChange('');
    }

    const handleEndDateChange = event => {
        const endDate = event.target.value;
        handleEndChange(endDate);
    }

    return (
        <>
            <label htmlFor={inputName}>{(inputName === 'start_day') ? "Borrow day" : "Return day"}
            <input
                onChange={(inputName === 'start_day')
                    ? handleStartDateChange
                    : handleEndDateChange
                }
                type="date"
                id={inputName}
                min={(inputName === 'start_day')
                    ? range.minStartDate
                    : range.minEndDate}
                max={(inputName === 'start_day')
                    ? range.maxStartDate
                    : range.maxEndDate}
                value={value}
            />
            </label>
        </>
    );
}

export default InputField;