export const masterActions = () => dispatch => {
    dispatch({
        type: 'GET_MASTERS',
        payload: 'page_of_masters'
    })
};