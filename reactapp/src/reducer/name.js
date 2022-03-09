const name = (state = [], action) => {
    switch (action.type) {
        case 'ADD_NAME':
            return ['helingkai']
        default:
            return state
    }
}

export default name