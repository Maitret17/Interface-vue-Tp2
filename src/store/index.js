import { createStore } from "vuex"

import pizza from "./modules/pizza"
import users from "./modules/users"

export default createStore({
	modules: {
		pizza,
		users
	}
})