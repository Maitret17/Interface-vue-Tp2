<script setup>
	import { ref, onMounted, onUnmounted } from "vue"
	import { useStore } from "vuex"
	import { useRouter } from "vue-router"

	const router = useRouter()
	const store = useStore()

	const username = ref("")
	const password = ref("")
	const message = ref("")

	const register = async () => {
		const success = await store.dispatch("users/register", {
			username: username.value,
			password: password.value
		})

		if (!success) {
			message.value = "Username already exists."
		} else {
			message.value = ""
			router.push("/")
		}
	}

	const login = async () => {
		const success = await store.dispatch("users/login", {
			username: username.value,
			password: password.value
		})

		if (!success) {
			message.value = "Invalid username or password."
		} else {
			message.value = ""
			router.push("/")
		}
	}	

	const submitAuth = event => {
		if (event.submitter.value === "register") {
			register()
		} else {
			login()
		}
	}

	let productionInterval

	onMounted(() => {
		store.dispatch("users/initializeAdmin")

		productionInterval = setInterval(() => {
			store.dispatch("pizza/producePassive")
		}, 1000)
	})

	onUnmounted(() => {
		clearInterval(productionInterval)
	})
</script>

<template>

	<form v-if="!$store.getters['users/isLoggedIn']" @submit.prevent="submitAuth" class="login-form">
		<h2>Login</h2>

		<input v-model="username" placeholder="Username" required />
		<input v-model="password" type="password" placeholder="Password" required />
		<div class="login-buttons">

			<button type="submit" value="login">
				Login
			</button>
			<button type="submit" value="register">
				Register
			</button>
		</div>

		<p v-if="message" class="login-message">
			{{ message }}
		</p>
	</form>
	<div v-else class="app-layout">
		<header class="topbar">
			<div class="brand">
				🍕 Pizza Clicker
			</div>
			<nav class="main-nav">
				<RouterLink to="/">
					Game
				</RouterLink>
				<RouterLink to="/leaderboard">
					Leaderboard
				</RouterLink>
				<RouterLink v-if="$store.getters['users/currentUser'].role === 'Admin'"to="/admin">
					Admin
				</RouterLink>
			</nav>
			<div class="user-area">
				<button class="save-button" @click="$store.dispatch('users/saveGame')">
					Save
				</button>
				<button class="logout-button" @click="$store.dispatch('users/logout')">
					Logout
				</button>
			</div>
		</header>
		<div class="page-container">
			<RouterView />
		</div>
	</div>
</template>

<style scoped></style>