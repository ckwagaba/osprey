import axios from 'axios';
import { API_BASE_URL } from '../../config';
import { IS_FETCHING, FETCH_JOBS_SUCCESS, FETCH_JOBS_FAILED } from './actionTypes';

export const startTheFetch = () => ({
  type: IS_FETCHING,
});

export const getJobsSuccess = (response) => (
  {
    type: FETCH_JOBS_SUCCESS,
    payload: response.data.data.jobs,
  });

export const getJobsFailed = (error) => ({
  type: FETCH_JOBS_FAILED,
  payload: {
    status: false,
    error: error.status,
  },
});

const getJobs = (clusterId) => (dispatch) => {
  dispatch(startTheFetch());
  return axios.get(`${API_BASE_URL}/clusters/${clusterId}/jobs`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then((response) => dispatch(getJobsSuccess(response)))
    .catch((error) => {
      dispatch(getJobsFailed(error));
    });
};

export default getJobs;
