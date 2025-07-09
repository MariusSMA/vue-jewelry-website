<template>
	<section class="login-page">
		<div v-if="showSuccessMessage" class="success-message">
			<p>Success!</p>
		</div>
		<div v-if="showErrorMessage" class="error-message">
			<p>{{ errorMessage }}</p>
		</div>
		<div v-if="showLogin">
			<!-- Login Form -->
			<form @submit.prevent="handleLogin">
				<h2>Login</h2>
				<input type="email" placeholder="Email" v-model="email" required />
				<input
					type="password"
					placeholder="Password"
					v-model="password"
					required
				/>
				<button type="submit" :disabled="loading">
					{{ loading ? "Logging in..." : "Login" }}
				</button>
				<p>
					Don't have an account?
					<span @click="toggleForm" style="cursor: pointer">Register</span>
				</p>
			</form>
		</div>
		<div v-else>
			<!-- Registration Form -->
			<form @submit.prevent="handleRegister">
				<h2>Register</h2>
				<input type="email" placeholder="Email" v-model="email" required />
				<input
					type="password"
					placeholder="Password"
					v-model="password"
					required
				/>
				<button type="submit" :disabled="loading">
					{{ loading ? "Registering..." : "Register" }}
				</button>
				<p>
					Already have an account?
					<span @click="toggleForm" style="cursor: pointer">Login</span>
				</p>
			</form>
		</div>
	</section>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

export default {
	name: "LoginPage",
	setup() {
		const router = useRouter();
		const store = useStore();
		const email = ref("");
		const password = ref("");
		const showLogin = ref(true);
		const showSuccessMessage = ref(false);
		const showErrorMessage = ref(false);
		const errorMessage = ref("");
		const loading = ref(false);

		const handleLogin = async () => {
			loading.value = true;
			try {
				const result = await store.dispatch("login", {
					email: email.value,
					password: password.value,
				});

				if (result.success) {
					showSuccessMessage.value = true;
					setTimeout(() => {
						router.push("/");
					}, 1000);
				} else {
					errorMessage.value = result.error;
					showErrorMessage.value = true;
					setTimeout(() => {
						showErrorMessage.value = false;
					}, 3000);
				}
			} catch (error) {
				errorMessage.value = "Login failed. Please try again.";
				showErrorMessage.value = true;
				setTimeout(() => {
					showErrorMessage.value = false;
				}, 3000);
			} finally {
				loading.value = false;
			}
		};

		const handleRegister = async () => {
			loading.value = true;
			try {
				const result = await store.dispatch("register", {
					email: email.value,
					password: password.value,
				});

				if (result.success) {
					showSuccessMessage.value = true;
					setTimeout(() => {
						router.push("/");
					}, 1000);
				} else {
					errorMessage.value = result.error;
					showErrorMessage.value = true;
					setTimeout(() => {
						showErrorMessage.value = false;
					}, 3000);
				}
			} catch (error) {
				errorMessage.value = "Registration failed. Please try again.";
				showErrorMessage.value = true;
				setTimeout(() => {
					showErrorMessage.value = false;
				}, 3000);
			} finally {
				loading.value = false;
			}
		};

		const toggleForm = () => {
			showLogin.value = !showLogin.value;
			email.value = "";
			password.value = "";
			showErrorMessage.value = false;
		};

		return {
			email,
			password,
			showLogin,
			showSuccessMessage,
			showErrorMessage,
			errorMessage,
			loading,
			handleLogin,
			handleRegister,
			toggleForm,
		};
	},
};
</script>
