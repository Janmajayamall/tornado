const default_state = {
    jwt_token:null,
    user_profile: null
}

//importing actions for the reducer
import {USER_INFO_UPDATE} from './action_names'

export default (state=default_state, actions)=>{
    switch(actions.type){
        case USER_INFO_UPDATE:
            return{
                ...state,
                ...actions.value
            }
        default:{
            return state
        }
    }
}