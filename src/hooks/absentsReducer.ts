type AbsentsAction =
  | { type: 'ADD_ABSENT' }
  | { type: 'REMOVE_ABSENT' }
  | { type: 'RESET_ABSENTS' };

const absentsReducer = (state: number, action: AbsentsAction): number => {
  switch (action.type) {
    case 'ADD_ABSENT':
      return state + 1;
    case 'REMOVE_ABSENT':
      return state > 0 ? state - 1 : 0; 
    case 'RESET_ABSENTS':
      return 0;
    default:
      throw new Error('Invalid action type');
  }
};

export default absentsReducer;





