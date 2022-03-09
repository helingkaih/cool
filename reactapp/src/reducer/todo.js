const todos = (state = [], action) => {
    console.log('action', action)
    switch (action.type) {
        case 'ADD_TODO':
            // return [
            //     ...state,
            //     {
            //         id: action.id,
            //         text: action.text,
            //         completed: false
            //     }
            // ]
            return [1]
        case 'TOGGLE_TODO':
            // return state.map(todo =>
            //     (todo.id === action.id)
            //         ? { ...todo, completed: !todo.completed }
            //         : todo
            // )
            return [2]
        default:
            return state
    }
}

export default todos