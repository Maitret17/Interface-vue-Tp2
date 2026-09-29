export default {
	namespaced: true,

	state: {
		users: JSON.parse(localStorage.getItem("users")) || [],
		currentUser: null
        // Current User becomes:
        // {
        //      username: username
        //      password: password
        //      role: role
        //      score: 0
        //      game: {
        //          pizza: 0
        //          autoproduction: 0,
        //          clickUpgrades: [],
        //          passiveUpgrades: [],
        //      }
        // }
        // Once a user registers, and when the user either logs out, or save his progression
	},

	getters: {
		isLoggedIn(state) {
			return state.currentUser !== null
		},

		currentUser(state) {
			return state.currentUser
		},
        
        leaderboard(state) {
	        return [...state.users]
		    .filter(user => user.role === "Player")
		    .sort((a, b) => b.score - a.score)
        },

        challengedPlayer(state) {
	        if (!state.currentUser?.challenge) {
		        return null
	        }

	        return state.users.find(
		        user => user.username === state.currentUser.challenge
	        ) || null
        }
	},

	mutations: {
		addUser(state, user) {
			state.users.push(user)

			localStorage.setItem(
				"users",
				JSON.stringify(state.users)
			)
		},

		setCurrentUser(state, user) {
			state.currentUser = user
		},

		clearCurrentUser(state) {
			state.currentUser = null
		},

		saveGame(state, game) {
			if (!state.currentUser) {
				return
			}

			const user = state.users.find(
				user => user.username === state.currentUser.username
			)

			if (!user) {
				return
			}

			user.game = game
			user.score = Math.floor(game.pizzas)

			localStorage.setItem(
				"users",
				JSON.stringify(state.users)
			)
		},

        setPlayerScore(state, { username, score }) {
	        const user = state.users.find(
		        user => user.username === username
	        )

	        if (!user) {
		        return
	        }

	        user.score = score

	        if (user.game) {
		        user.game.pizzas = score
	        }

	        localStorage.setItem(
		        "users",
		        JSON.stringify(state.users)
	        )
        },

        resetPlayer(state, username) {
	        const user = state.users.find(
		        user => user.username === username
	        )

	        if (!user) {
		        return
	        }

	        user.score = 0
	        user.game = null

	        localStorage.setItem(
		        "users",
		        JSON.stringify(state.users)
	        )
        },

        setChallenge(state, username) {
	        if (!state.currentUser || state.currentUser.role !== "Player") {
		        return
	        }

	        const opponent = state.users.find(
		        user =>
			        user.username === username &&
			        user.role === "Player"
	        )

	        if (!opponent) {
		        return
	        }

	        if (opponent.username === state.currentUser.username) {
		        return
	        }

	        const currentUser = state.users.find(
		        user => user.username === state.currentUser.username
	        )

	        currentUser.challenge = username

	        localStorage.setItem(
		        "users",
		        JSON.stringify(state.users)
	        )
        },

        clearChallenge(state) {
	        if (!state.currentUser) {
		        return
	        }

	        const currentUser = state.users.find(
		        user => user.username === state.currentUser.username
	        )

	        if (!currentUser) {
		        return
	        }

	        currentUser.challenge = null

	        localStorage.setItem(
		        "users",
		        JSON.stringify(state.users)
	        )
        }
	},

	actions: {
		register({ state, commit }, { username, password }) {
			const existingUser = state.users.find(
				user => user.username === username
			)

			if (existingUser) {
				return false
			}

			const newUser = {
				username: username,
				password: password,
                role: "Player",
				score: 0,
				game: null,
                challenge: null
			}

			commit("addUser", newUser)
			commit("setCurrentUser", newUser)

			commit("pizza/resetGame", null, {
				root: true
			})

			return true
		},

        initializeAdmin({ state, commit }) {
	        const adminExists = state.users.some(
		        user => user.role === "Admin"
	        )

	        if (!adminExists) {
		        const admin = {
			        username: "admin",
			        password: "admin",
			        role: "Admin",
			        score: 0,
			        game: null
		        }

		        commit("addUser", admin)
	        }
        },

		login({ state, commit }, { username, password }) {
			const user = state.users.find(
				user =>
					user.username === username &&
					user.password === password
			)

			if (!user) {
				return false
			}

			commit("setCurrentUser", user)

			if (user.game) {
				commit("pizza/loadGame", user.game, {
					root: true
				})
			} else {
				commit("pizza/resetGame", null, {
					root: true
				})
			}

			return true
		},

		saveGame({ commit, rootState }) {
			const game = JSON.parse(
				JSON.stringify(rootState.pizza)
			)

			commit("saveGame", game)
		},

		async logout({ dispatch, commit }) { // We need async here so we can await saveGame before clearing the current user and resetting the game.
			await dispatch("saveGame")

			commit("clearCurrentUser")

			commit("pizza/resetGame", null, {
				root: true
			})
		}
	}
}