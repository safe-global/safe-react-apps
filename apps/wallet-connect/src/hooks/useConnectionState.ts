import { useReducer } from 'react';

export const DISCONNECTED_STATE = 'DISCONNECTED_STATE';
export const CONNECTING_STATE = 'CONNECTING_STATE';
export const CONNECTED_STATE = 'CONNECTED_STATE';

export const CONNECT_EVENT = 'CONNECT_EVENT';
export const DISCONNECT_EVENT = 'DISCONNECT_EVENT';

let STATE_GRAPH: { [key: string]: { [key: string]: string } } = {
  DISCONNECTED_STATE: {
    CONNECT_EVENT: CONNECTING_STATE,
  },
  CONNECTING_STATE: {
    CONNECT_EVENT: CONNECTED_STATE,
  },
  CONNECTED_STATE: {
    DISCONNECT_EVENT: DISCONNECTED_STATE,
  },
};

const reducer = (state: string, event: string) => {
  const nextState = STATE_GRAPH[state][event];
  return nextState !== undefined ? nextState : state;
};

function useConnectionState(initialState: string = DISCONNECTED_STATE) {
  const [connectionStatus, dispatch] = useReducer(reducer, initialState);

  return {
    connectionStatus,
    changeConnectionStatus: dispatch,
  };
}

export default useConnectionState;
