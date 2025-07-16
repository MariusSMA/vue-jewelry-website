<template>
	<section class="profile">
		<div class="container">
			<h1>Profile</h1>
			<div v-if="currentUser">
				<p>Welcome, {{ currentUser.email }}</p>
				<div class="profile-info">
					<h3>Account Information</h3>
					<ul>
						<li>
							<strong>Email:</strong>
							{{ currentUser.email }}
						</li>
						<li>
							<strong>Member since:</strong>
							{{ formatDate(currentUser.metadata?.creationTime) }}
						</li>
						<li>
							<strong>Role:</strong>
							{{ isAdmin ? "Admin" : "User" }}
						</li>
					</ul>
				</div>

				<div class="profile-actions">
					<h3>Quick Actions</h3>
					<ul>
						<li><router-link to="/shopping-cart">View Cart</router-link></li>
						<li><router-link to="/catalogue">Browse Products</router-link></li>
						<li v-if="isAdmin">
							<router-link to="/admin" class="admin-link">
								Admin Panel
							</router-link>
						</li>
					</ul>
				</div>

				<button class="logout-button" @click="handleLogout">Logout</button>
			</div>
			<div v-else>
				<p>Loading user information...</p>
			</div>
		</div>
	</section>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

export default {
	name: "ProfilePage",
	setup() {
		const store = useStore();
		const router = useRouter();

		const currentUser = computed(() => store.getters.currentUser);
		const isAdmin = computed(() => store.getters.isAdmin);

		const handleLogout = async () => {
			try {
				await store.dispatch("logout");
				router.push("/");
			} catch (error) {
				console.error("Logout failed:", error);
			}
		};

		const formatDate = timestamp => {
			if (!timestamp) return "Unknown";
			return new Date(timestamp).toLocaleDateString();
		};

		return {
			currentUser,
			isAdmin,
			handleLogout,
			formatDate,
		};
	},
};
</script>

<style scoped>
.profile {
	min-height: 100vh;
	padding: 2rem 0;
	background-color: #f8f9fa;
}

.container {
	max-width: 800px;
	margin: 0 auto;
	padding: 0 1rem;
}

h1 {
	text-align: center;
	color: #fff;
	margin: 2rem;
}

.profile-info,
.profile-actions {
	background: white;
	border-radius: 8px;
	padding: 1.5rem;
	margin-bottom: 1.5rem;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.profile-info h3,
.profile-actions h3 {
	color: #007bff;
	margin-bottom: 1rem;
	border-bottom: 2px solid #007bff;
	padding-bottom: 0.5rem;
}

.profile-info ul,
.profile-actions ul {
	list-style: none;
	padding: 0;
	color: #007bff;
}

.profile-info li {
	padding: 0.5rem 0;
	border-bottom: 1px solid #eee;
}

.profile-info li:last-child {
	border-bottom: none;
}

.profile-actions li {
	margin-bottom: 0.5rem;
}

.profile-actions a {
	color: #007bff;
	text-decoration: none;
	padding: 0.5rem 1rem;
	border-radius: 4px;
	transition: all 0.3s;
	display: inline-block;
}

.profile-actions a:hover {
	background-color: #007bff;
	color: white;
}

.profile-actions a.admin-link {
	background-color: #28a745;
	color: white;
	font-weight: bold;
}

.profile-actions a.admin-link:hover {
	background-color: #218838;
}

.logout-button {
	background-color: #dc3545;
	color: white;
	border: none;
	padding: 0.75rem 0;
	border-radius: 4px;
	cursor: pointer;
	font-size: 1rem;
	transition: background-color 0.3s;
	margin: 2rem auto;
	max-width: 7rem;
  text-align: center;

}

.logout-button:hover {
	background-color: #c82333;
}

p {
	text-align: center;
	color: #fff;
	font-size: 1.1rem;
	margin-bottom: 2rem;
}
</style>
