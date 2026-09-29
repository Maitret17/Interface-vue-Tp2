<script setup>
	import { ref } from "vue"
	import { useStore } from "vuex"

	const store = useStore()

	const newScores = ref({})

	const changeScore = username => {
		const score = Number(newScores.value[username])

		if (isNaN(score) || score < 0) {
			return
		}

		store.commit("users/setPlayerScore", {
			username,
			score
		})
	}

	const resetPlayer = username => {
		store.commit("users/resetPlayer", username)
	}
</script>

<template>
	<div>
		<h1>Admin Panel</h1>

		<div
			v-for="user in $store.state.users.users"
			:key="user.username"
		>
			<div v-if="user.role === 'Player'">
				<h3>{{ user.username }}</h3>

				<p>
					Score: {{ user.score }}
				</p>

				<input
					v-model="newScores[user.username]"
					type="number"
					min="0"
					placeholder="New score"
				/>

				<button @click="changeScore(user.username)">
					Change Score
				</button>

				<button @click="resetPlayer(user.username)">
					Reset Game
				</button>
			</div>
		</div>
	</div>
</template>

<style scoped></style>