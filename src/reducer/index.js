import { combineReducers } from 'redux'
import {createUser} from './auth.reducer';
import {createCategory} from './category.reducer';
import {product} from './product.reducer';
import {userReducer} from './user.reducer';
import {myBooksReducer} from './mybooks.reducer';
import { exchangeReducer } from './exchange.reducer';
import { chatReducer } from './chat.reducer'

const rootReducer = combineReducers({
	product,
	createCategory,
	createUser,
	userReducer,
	myBooksReducer,
	exchangeReducer,
	chatReducer
})

export default (state, action) =>
	rootReducer(action.type === 'signOut' ? undefined : state, action);
