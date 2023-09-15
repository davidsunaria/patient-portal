

import { createContext, useCallback, useContext, useReducer} from "react";

const SlotContext = createContext({
});

const initialState = {
    slot: null,
    slots: []
}

export const SlotActions = {
    SET_SLOTS: "SET_SLOTS",
    SET_SLOT: "SET_SLOT",

} 

const slotReducer = (state = initialState, action) => {
    switch (action.type) {
        case SlotActions.SET_SLOT:
            return { ...state, slot: action.payload }
        case SlotActions.SET_SLOTS:
            return { ...state, slots: action.payload }
        default:
            return state
    }
}


export const SlotProvider = ({ children }) => {

    const [state, dispatch] = useReducer(slotReducer, initialState);

    return (<SlotContext.Provider value={{
        state, dispatch
    }} >
        {children}
    </SlotContext.Provider>)
}

export const useSlotDispatch = () => {
    const { dispatch } = useContext(SlotContext)
    
    return dispatch
}

export const useSlotActions = () => {
    const { dispatch } = useContext(SlotContext)

    const setSlotAction = useCallback( (payload)=>{
        dispatch({type:SlotActions.SET_SLOT,payload})
    },[])

    const setSlotsAction = useCallback( (payload)=>{
        dispatch({type:SlotActions.SET_SLOTS,payload})
    },[])

    return {setSlotsAction,setSlotAction}
}

export const useSlotState = () => {
    const { state } = useContext(SlotContext)
    return state
}

