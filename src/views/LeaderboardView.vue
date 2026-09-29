<script setup>
	import { computed } from "vue"
	import { useStore } from "vuex"

	const store = useStore()

	const leaderboard = computed(() => {
		return store.getters["users/leaderboard"]
	})

	const currentUser = computed(() => {
		return store.getters["users/currentUser"]
	})

	const challengedPlayer = computed(() => {
		return store.getters["users/challengedPlayer"]
	})

	const challengePlayer = username => {
		store.commit("users/setChallenge", username)
	}

	const clearChallenge = () => {
		store.commit("users/clearChallenge")
	}

	const currentScore = computed(() => {
		return Math.floor(store.state.pizza.pizzas)
	})

	const scoreDifference = computed(() => {
		if (!challengedPlayer.value) {
			return 0
		}

		return currentScore.value - challengedPlayer.value.score
	})
</script>

<template>
	<div>
		<h1>Leaderboard</h1>

		<table>
			<thead>
				<tr>
					<th>Rank</th>
					<th>Player</th>
					<th>Score</th>

					<th v-if="currentUser.role === 'Player'">
						Challenge
					</th>
				</tr>
			</thead>

			<tbody>
				<tr
					v-for="(user, index) in leaderboard"
					:key="user.username"
				>
					<td>{{ index + 1 }}</td>

					<td>{{ user.username }}</td>

					<td>{{ user.score }}</td>

					<td v-if="currentUser.role === 'Player'">
						<span v-if="user.username === currentUser.username">
							You
						</span>

						<button
							v-else-if="currentUser.challenge !== user.username"
							@click="challengePlayer(user.username)"
						>
							Challenge
						</button>

						<button
							v-else
							disabled
						>
							Challenged
						</button>
					</td>
				</tr>
			</tbody>
		</table>

		<div
			v-if="
				currentUser.role === 'Player' &&
				challengedPlayer
			"
		>
			<h2>Current Challenge</h2>

			<p>
				Opponent:
				{{ challengedPlayer.username }}
			</p>

			<p>
				Your score:
				{{ currentScore }}
			</p>

			<p>
				Opponent score:
				{{ challengedPlayer.score }}
			</p>

			<p v-if="scoreDifference >= 0">
				You are ahead by
				{{ scoreDifference }} pizzas.
			</p>

			<p v-else>
				You need
				{{ Math.abs(scoreDifference) }}
				more pizzas to overtake them.
			</p>

			<button @click="clearChallenge">
				Cancel Challenge
			</button>
		</div>
	</div>
</template>

<style scoped></style>