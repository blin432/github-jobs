//custom hook
import { useReducer, useEffect } from 'react';
import axios from 'axios';


const ACTIONS = {
    MAKE_REQUESTS: 'make-requests',
    GET_DATA: 'get-data',
    ERROR:'error'
}
//cors error url
const BASE_URL = 'https://cors-anywhere.herokuapp.com/https://jobs.github.com/positions.json'

function reducer(state, action) {
    switch (action.type) {
        case ACTIONS.MAKE_REQUESTS:
            return { loading: true, jobs: [] }
        case ACTIONS.GET_DATA:
            return { ...state, loading: false, jobs: ACTIONS.payload.jobs }
        case ACTIONS.ERROR:
            return { ...state, loading: false, error: action.payload.error, jobs: [] }
        default:
            return state
    }
}
export default function useFetchJobs(params, page) {
    //useReducer takes a function and initial state
    const [state, dispatch] = useReducer(reducer, { jobs: [], loading: true })
    
    useEffect(() => {
        //stop api calls when axios requests pile up. When params change cancel our old request
        const cancelToken  = axios.CancelToken.source()
        dispatch({ type: ACTIONS.MAKE_REQUESTS })
        axios.get(BASE_URL, {
            cancelToken:cancelToken.token,
            params: {markdown:true, page:page, ...params}
        }).then(res => {
            dispatch({type:ACTIONS.GET_DATA, payload:{jobs:res.data}})
        }).catch(e => {
            if (axios.isCancel(e)) return
            dispatch({type:ACTIONS.ERROR, payload:{error:e}})
        })
        //when return statement is added here a function will run whenever "params or page" change.
        return () => {
            cancelToken.cancel()
        }

    }, [params, page])
    return {
        state
    }
    
}