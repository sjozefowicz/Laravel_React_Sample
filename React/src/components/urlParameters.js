import {useLocation} from "react-router-dom";

export const useUrlParameters = (parameter) => {
    const parameters = useLocation().search
    if (parameters === '') {return (parameter === 'page') ? 1 : ''}
    const multipleParameters = parameters.match(/&/g)
    const indexOfParameter = parameters.indexOf(`${parameter}=`) + (parameter.length + 1)
    return (parameters.includes(parameter))
        ? (multipleParameters)
            ? (parameter === 'page')
                ? parameters.substring(indexOfParameter)
                : parameters.substring(indexOfParameter,
                    indexOfParameter + (parameters.substring(indexOfParameter).indexOf('&'))).replaceAll('%20', ' ')
            : parameters.substring(indexOfParameter)
        : (parameters.includes('page') && parameter === 'page') ? 1 : ''
}