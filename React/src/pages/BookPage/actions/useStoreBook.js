export const useStoreBook = (token, data, setData, setMessage) => {
    if (data !== '') {
        console.log('fetch')
        console.log(data)
        fetch('http://www.site.loc/api/request/store', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(data),
        })
            .then(response => response.json())
            .then(data => {
                if (typeof data === 'string') {
                    setMessage(data);
                } else {
                    setMessage('Request was sent, check your email for actual status.');
                }
            })
            .catch(error => {
                setMessage('Something wrong happened. Please try again');
            });
        setData('')
    }
}