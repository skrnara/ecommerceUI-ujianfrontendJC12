const INITIAL_STATE={
    cartNumber:0
}

export default(state=INITIAL_STATE, action)=>{
    switch(action.type){
        case 'CARTCOUNTER':
            return {...state, cartNumber:action.payload}
        default:
            return state
    }
}
