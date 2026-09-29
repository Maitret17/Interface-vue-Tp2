export default {
	namespaced: true,

	state: {
		pizzas: 0,
		autoProduction: 0,

		clickUpgrades: [
			{
				id: 1,
				name: "Better Dough",
				icon: "🥖",
				baseCost: 25,
				cost: 25,
				bonus: 1,
				amount: 0
			},
			{
				id: 2,
				name: "Better Tomato Sauce",
				icon: "🍅",
				baseCost: 100,
				cost: 100,
				bonus: 2,
				amount: 0
			},
			{
				id: 3,
				name: "Fresh Mozzarella",
				icon: "🧀",
				baseCost: 400,
				cost: 400,
				bonus: 5,
				amount: 0
			},
			{
				id: 4,
				name: "Premium Toppings",
				icon: "🍄",
				baseCost: 1500,
				cost: 1500,
				bonus: 10,
				amount: 0
			}
		],

		passiveUpgrades: [
			{
				id: 1,
				name: "Employee",
				icon: "🧑‍🍳",
				baseCost: 50,
				cost: 50,
				production: 1,
				amount: 0
			},
			{
				id: 2,
				name: "Delivery Driver",
				icon: "🛵",
				baseCost: 250,
				cost: 250,
				production: 5,
				amount: 0
			},
			{
				id: 3,
				name: "Pizzaiolo",
				icon: "🍕",
				baseCost: 1000,
				cost: 1000,
				production: 20,
				amount: 0
			},
			{
				id: 4,
				name: "Italian Chef",
				icon: "👨‍🍳",
				baseCost: 5000,
				cost: 5000,
				production: 75,
				amount: 0
			}
		],

		multiplier: 1,

		multiplierUpgrades: {
			name: "Franchise Expansion",
			icon: "🏪",
			baseCost: 1000000,
			cost: 1000000,
			factor: 2,
			amount: 0
		}
	},

	getters: {
		clickPower(state) {
			const basePower = 1 + state.clickUpgrades.reduce(
				(total, upgrade) =>
					total + upgrade.bonus * upgrade.amount,
				0
			)

			return basePower * state.multiplier
		},

		effectiveAutoProduction(state) {
			return state.autoProduction * state.multiplier
		},

		gameStats(state, getters) {
			return {
				pizzas: state.pizzas,
				clickPower: getters.clickPower,
				pizzasPerSecond: getters.effectiveAutoProduction
			}
		}
	},

	mutations: {
		addPizzas(state, amount) {
			state.pizzas += amount
		},

		buyClickUpgrade(state, id) {
			const upgrade = state.clickUpgrades.find(
				upgrade => upgrade.id === id
			)

			if (upgrade && state.pizzas >= upgrade.cost) {
				state.pizzas -= upgrade.cost
				upgrade.amount++

				upgrade.cost = Math.ceil(
					upgrade.cost * 1.15
				)
			}
		},

		buyPassiveUpgrade(state, id) {
			const upgrade = state.passiveUpgrades.find(
				upgrade => upgrade.id === id
			)

			if (upgrade && state.pizzas >= upgrade.cost) {
				state.pizzas -= upgrade.cost
				upgrade.amount++

				state.autoProduction += upgrade.production

				upgrade.cost = Math.ceil(
					upgrade.cost * 1.15
				)
			}
		},

		buyMultiplicationUpgrade(state) {
			const upgrade = state.multiplierUpgrades

			if (state.pizzas >= upgrade.cost) {
				state.pizzas -= upgrade.cost

				upgrade.amount++
				state.multiplier *= upgrade.factor

				upgrade.cost = Math.ceil(
					upgrade.cost * 2
				)
			}
		},

		automaticProduction(state) {
			state.pizzas +=
				state.autoProduction * state.multiplier
		},

		resetGame(state) {
			state.pizzas = 0
			state.autoProduction = 0
			state.multiplier = 1

			state.clickUpgrades.forEach(upgrade => {
				upgrade.amount = 0
				upgrade.cost = upgrade.baseCost
			})

			state.passiveUpgrades.forEach(upgrade => {
				upgrade.amount = 0
				upgrade.cost = upgrade.baseCost
			})

			state.multiplierUpgrades.amount = 0
			state.multiplierUpgrades.cost =
				state.multiplierUpgrades.baseCost
		},

		loadGame(state, game) {
			state.pizzas = game?.pizzas ?? 0

			state.autoProduction =
				game?.autoProduction ?? 0

			state.multiplier =
				game?.multiplier ?? 1

			state.clickUpgrades.forEach(upgrade => {
				const savedUpgrade =
					game?.clickUpgrades?.find(
						saved => saved.id === upgrade.id
					)

				upgrade.amount =
					savedUpgrade?.amount ?? 0

				upgrade.cost =
					savedUpgrade?.cost ??
					upgrade.baseCost
			})

			state.passiveUpgrades.forEach(upgrade => {
				const savedUpgrade =
					game?.passiveUpgrades?.find(
						saved => saved.id === upgrade.id
					)

				upgrade.amount =
					savedUpgrade?.amount ?? 0

				upgrade.cost =
					savedUpgrade?.cost ??
					upgrade.baseCost
			})

			state.multiplierUpgrades.amount =
				game?.multiplierUpgrades?.amount ?? 0

			state.multiplierUpgrades.cost =
				game?.multiplierUpgrades?.cost ??
				state.multiplierUpgrades.baseCost
		}
	},

	actions: {
		makePizza({ commit, getters }) {
			commit(
				"addPizzas",
				getters.clickPower
			)
		},

		producePassive({ commit, state }) {
			if (state.autoProduction > 0) {
				commit("automaticProduction")
			}
		}
	}
}