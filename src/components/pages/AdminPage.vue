<template>
	<div class="admin-page">
		<div class="container">
			<h1>Admin Dashboard</h1>

			<!-- Only show admin content if user is admin -->
			<div v-if="isAdmin" class="admin-content">
				<div class="admin-section">
					<h2>Product Management</h2>
					<p>Import products from JSON file to Firestore database.</p>

					<div class="import-section">
						<div v-if="importStatus" class="import-status">
							<div v-if="importing" class="loading">
								<div class="spinner"></div>
								<p>Importing products... Please wait.</p>
							</div>

							<div v-else-if="importResults" class="results">
								<div v-if="importResults.success > 0" class="success">
									✅ Successfully imported {{ importResults.success }} new
									products
								</div>
								<div v-if="importResults.skipped > 0" class="info">
									⏭️ Skipped {{ importResults.skipped }} existing products
								</div>
								<div v-if="importResults.errors.length > 0" class="error">
									❌ {{ importResults.errors.length }} errors occurred:
									<ul>
										<li
											v-for="error in importResults.errors"
											:key="error.product"
										>
											{{ error.product }}: {{ error.error }}
										</li>
									</ul>
								</div>
							</div>
						</div>

						<button
							@click="importProducts"
							:disabled="importing"
							class="import-button"
						>
							{{ importing ? "Importing..." : "Import Products from JSON" }}
						</button>
					</div>
				</div>
			</div>

			<!-- Show message if user is not admin -->
			<div v-else class="no-admin">
				<p>You don't have admin privileges to view this page.</p>
				<router-link to="/profile" class="back-link">
					← Back to Profile
				</router-link>
			</div>
		</div>
	</div>
</template>

<script>
import { ref, computed } from "vue";
import { useStore } from "vuex";
import { productService } from "@/services/productService";
import productsData from "@/assets/data/products.json";

export default {
	name: "AdminPage",
	setup() {
		const store = useStore();
		const importing = ref(false);
		const importStatus = ref(false);
		const importResults = ref(null);

		const isAdmin = computed(() => store.getters.isAdmin);

		const importProducts = async () => {
			importing.value = true;
			importStatus.value = true;
			importResults.value = null;

			try {
				const results = await productService.batchImportProducts(productsData);
				importResults.value = results;
			} catch (error) {
				importResults.value = {
					success: 0,
					skipped: 0,
					errors: [{ product: "Import Process", error: error.message }],
					total: productsData.length,
				};
			} finally {
				importing.value = false;
			}
		};

		return {
			isAdmin,
			importing,
			importStatus,
			importResults,
			importProducts,
		};
	},
};
</script>

<style scoped>
.admin-page {
	min-height: 100vh;
	padding: 2rem 0;
	background-color: #f8f9fa;
}

.container {
	max-width: 1200px;
	margin: 0 auto;
	padding: 0 1rem;
}

h1 {
	color: #333;
	text-align: center;
	margin-bottom: 2rem;
}

.admin-content {
	background: white;
	border-radius: 8px;
	padding: 2rem;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.admin-section {
	margin-bottom: 2rem;
}

.admin-section h2 {
	color: #007bff;
	margin-bottom: 1rem;
}

.import-section {
	background: #f8f9fa;
	padding: 1.5rem;
	border-radius: 6px;
	border-left: 4px solid #007bff;
}

.import-button {
	background-color: #28a745;
	color: white;
	border: none;
	padding: 0.75rem 1.5rem;
	border-radius: 4px;
	cursor: pointer;
	font-size: 1rem;
	font-weight: 500;
	transition: background-color 0.3s;
}

.import-button:hover:not(:disabled) {
	background-color: #218838;
}

.import-button:disabled {
	background-color: #6c757d;
	cursor: not-allowed;
}

.import-status {
	margin-bottom: 1rem;
	padding: 1rem;
	border-radius: 4px;
	background-color: white;
	border: 1px solid #dee2e6;
}

.loading {
	text-align: center;
	color: #007bff;
}

.spinner {
	border: 4px solid #f3f3f3;
	border-top: 4px solid #007bff;
	border-radius: 50%;
	width: 40px;
	height: 40px;
	animation: spin 1s linear infinite;
	margin: 0 auto 1rem;
}

@keyframes spin {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}

.results {
	margin-top: 1rem;
}

.success {
	color: #28a745;
	font-weight: bold;
	margin-bottom: 0.5rem;
}

.info {
	color: #ffc107;
	font-weight: bold;
	margin-bottom: 0.5rem;
}

.error {
	color: #dc3545;
	font-weight: bold;
}

.error ul {
	margin-top: 0.5rem;
	padding-left: 1rem;
}

.no-admin {
	text-align: center;
	padding: 3rem;
	background: white;
	border-radius: 8px;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.no-admin p {
	color: #6c757d;
	font-size: 1.1rem;
	margin-bottom: 1rem;
}

.back-link {
	color: #007bff;
	text-decoration: none;
	font-weight: 500;
}

.back-link:hover {
	text-decoration: underline;
}
</style>
