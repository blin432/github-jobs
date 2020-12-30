//custom hook
import { useReducer, useEffect } from 'react';
import axios from 'axios';


const ACTIONS = {
    MAKE_REQUESTS: 'make-requests',
    GET_DATA: 'get-data',
    ERROR: 'error',
    UPDATE_HAS_NEXT_PAGE:'update-has-next-page'
}
//cors error url
const BASE_URL = 'https://cors-anywhere.herokuapp.com/https://jobs.github.com/positions.json';

function reducer(state, action) {
    switch (action.type) {
        case ACTIONS.MAKE_REQUESTS:
            return { loading: true, jobs: [] }
        case ACTIONS.GET_DATA:
            return { ...state, loading: false, jobs: action.payload.jobs }
        case ACTIONS.ERROR:
            return { ...state, loading: false, error: action.payload.error, jobs: [] }
        case ACTIONS.UPDATE_HAS_NEXT_PAGE:
            return {...state, hasNextPage:action.payload.hasNextPage}
        default:
            return state
    }
}
export default function useFetchJobs(params, page) {
    //useReducer takes a function and initial state
    const [state, dispatch] = useReducer(reducer, { jobs: [], loading: true })
    
    useEffect(() => {
        //stop api calls when axios requests pile up. When params change cancel our old request
        const cancelToken1 = axios.CancelToken.source()
        dispatch({ type: ACTIONS.MAKE_REQUESTS })
        axios.get(BASE_URL, {
            cancelToken:cancelToken1.token,
            params: {markdown:true, page: page, ...params}
        }).then(res => {
            dispatch({type:ACTIONS.GET_DATA, payload:{jobs:res.data}})
        }).catch(e => {
            if (axios.isCancel(e)) return
            dispatch({type:ACTIONS.ERROR, payload:{error:e}})
        })
        const cancelToken2 = axios.CancelToken.source()
           axios.get(BASE_URL, {
            cancelToken:cancelToken2.token,
            params: {markdown:true, page: page + 1, ...params}
        }).then(res => {
            dispatch({type:ACTIONS.UPDATE_HAS_NEXT_PAGE, payload:{hasNextPage:res.data.length !== 0}})
        }).catch(e => {
            if (axios.isCancel(e)) return
            dispatch({type:ACTIONS.ERROR, payload:{error:e}})
        })
        //when return statement is added here a function will run whenever "params or page" change.
        return () => {
            cancelToken1.cancel()
            cancelToken2.cancel()
        }

    }, [params, page])
    return state
}