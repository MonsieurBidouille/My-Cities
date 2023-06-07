const initialState = {favs:[],crnt_usr:"",crnt_role:"",crnt_id:""};

function UserReducer(state=initialState,action){
    let nextState;
    switch(action.type){

        case'crnt_user':
            nextState = {...state,
            crnt_usr:action.value 
        };
        return nextState;

        case'crnt_role':
            nextState = {...state,
            crnt_role:action.value
        };
        return nextState;

        case'crnt_id':
            nextState = {...state,
            crnt_id:action.value
        };
        return nextState;

        case'add_fav':
            nextState = {...state,
            favs:action.value
        };
        return nextState;

        default:
             return state;
    }
}

export default UserReducer;

