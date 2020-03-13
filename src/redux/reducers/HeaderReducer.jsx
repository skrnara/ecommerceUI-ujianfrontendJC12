const INITIAL_STATE={
    ishome:true
}

export default (state=INITIAL_STATE, action)=>{
    switch(action.type){
        case 'NONHOME':
            return {...state, ishome:false}
        case 'ISHOME':
            return {...state, ishome:true}
        default:
            return state
    }
}