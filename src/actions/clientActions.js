import {GET_CLIENTS, ADD_CLIENT} from "../constants/clientConstants";
import {getClients} from "../service/clientService";

export const getClientsAction = (params) => dispatch => {
    getClients(params).then(clients => {
        dispatch({
            type: GET_CLIENTS,
            payload: clients
        })
    });
};