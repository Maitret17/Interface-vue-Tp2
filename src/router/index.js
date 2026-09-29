import { createRouter, createWebHistory } from "vue-router"

import GameView from "../views/GameView.vue"
import AdminView from "../views/AdminView.vue"
import store from "../store/index.js"
import LeaderboardView from "../views/LeaderboardView.vue"

const router = createRouter({
    
	history: createWebHistory(),

    

	routes: [
	    {
		    path: "/",
		    name: "game",
		    component: GameView
	    },
	    {
		    path: "/leaderboard",
		    name: "leaderboard",
		    component: LeaderboardView
	    },
	    {
		    path: "/admin",
		    name: "admin",
		    component: AdminView,
		    meta: {
			    requiresAdmin: true
		    }
	    }
    ]
})

router.beforeEach(to => { // Avoid non admin user to reach admin only pages
	if (
		to.meta.requiresAdmin &&
		store.getters["users/currentUser"]?.role !== "Admin"
	) {
		return "/"
	}
})

export default router