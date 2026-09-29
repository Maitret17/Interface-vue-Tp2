<script setup></script>

<template>
	<main class="game-page">

		<section class="clicker-panel">

			<div class="score-area">
				<h1>Pizza Clicker</h1>
				<p class="pizza-count">
					{{ Math.floor($store.state.pizza.pizzas) }}
				</p>
				<p class="pizza-label">
					Pizzas
				</p>
			</div>

			<button class="pizza-button" @click="$store.dispatch('pizza/makePizza')" aria-label="Make a pizza">
				🍕
			</button>
			<div class="production-stats">
				<div class="stat">
					<strong>
						{{ $store.getters["pizza/clickPower"] }}
					</strong>
					<span>
						per click
					</span>
				</div>
				<div class="stat">
					<strong>
						{{ $store.getters["pizza/effectiveAutoProduction"] }}
					</strong>
					<span>
						per second
					</span>
				</div>
				<div class="stat">
					<strong>
						×{{ $store.state.pizza.multiplier }}
					</strong>
					<span>
						multiplier
					</span>
				</div>
			</div>
		</section>

		<section class="upgrades-grid">
			<div class="upgrade-category">
				<div class="category-header">
					<div>
						<span class="category-label">
							Ingredients
						</span>
						<h2>Click upgrades</h2>
					</div>
					<span class="category-icon">
						🖱️
					</span>
				</div>
				<div class="upgrade-list">
					<article v-for="upgrade in $store.state.pizza.clickUpgrades":key="upgrade.id" class="upgrade-card">
						<div class="upgrade-top">

							<span class="upgrade-icon">
								{{ upgrade.icon }}
							</span>

							<div class="upgrade-title">
								<h3>{{ upgrade.name }}</h3>

								<span>
									Owned: {{ upgrade.amount }}
								</span>
							</div>

						</div>

						<p class="upgrade-effect">
							+{{ upgrade.bonus * $store.state.pizza.multiplier}}
							pizzas per click
						</p>

						<button
							class="buy-button"
							:disabled="
								$store.state.pizza.pizzas <
								upgrade.cost
							"
							@click="
								$store.commit(
									'pizza/buyClickUpgrade',
									upgrade.id
								)
							"
						>
							<span>Buy</span>

							<strong>
								{{ upgrade.cost }} 🍕
							</strong>
						</button>

					</article>

				</div>

			</div>

			<div class="upgrade-category">

				<div class="category-header">

					<div>
						<span class="category-label">
							Staff
						</span>

						<h2>Passive upgrades</h2>
					</div>

					<span class="category-icon">
						⚙️
					</span>

				</div>

				<div class="upgrade-list">
					<article v-for="upgrade in $store.state.pizza.passiveUpgrades" :key="upgrade.id" class="upgrade-card">
						<div class="upgrade-top">
							<span class="upgrade-icon">
								{{ upgrade.icon }}
							</span>
							<div class="upgrade-title">
								<h3>{{ upgrade.name }}</h3>
								<span>
									Owned: {{ upgrade.amount }}
								</span>
							</div>
						</div>
						<p class="upgrade-effect">
							+ {{ upgrade.production * $store.state.pizza.multiplier }}
							pizzas per second
						</p>
						<button
							class="buy-button"
							:disabled="
								$store.state.pizza.pizzas <
								upgrade.cost
							"
							@click="
								$store.commit(
									'pizza/buyPassiveUpgrade',
									upgrade.id
								)
							"
						>
							<span>Buy</span>
							<strong>
								{{ upgrade.cost }} 🍕
							</strong>
						</button>
					</article>
				</div>
			</div>
		</section>

		<section class="franchise-panel">

			<div class="franchise-icon">
				{{ $store.state.pizza.multiplierUpgrades.icon }}
			</div>

			<div class="franchise-content">

				<span class="category-label">
					Franchise
				</span>

				<h2>
					{{ $store.state.pizza.multiplierUpgrades.name }}
				</h2>

				<p>
					Multiply all pizza production by
					<strong>
						×{{ $store.state.pizza.multiplierUpgrades.factor }}
					</strong>
				</p>

				<span class="franchise-owned">
					Expansions:
					{{ $store.state.pizza.multiplierUpgrades.amount }}
				</span>

			</div>

			<button class="franchise-buy":disabled=" $store.state.pizza.pizzas < $store.state.pizza.multiplierUpgrades.cost" @click="$store.commit('pizza/buyMultiplicationUpgrade')">
				<span>Expand</span>

				<strong>
					{{ $store.state.pizza.multiplierUpgrades.cost }}
					🍕
				</strong>
			</button>
		</section>
	</main>
</template>

<style scoped></style>