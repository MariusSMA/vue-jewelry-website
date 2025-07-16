import { db } from "../firebase";
import {
	collection,
	getDocs,
	doc,
	getDoc,
	addDoc,
	updateDoc,
	deleteDoc,
	query,
	where,
	writeBatch,
} from "firebase/firestore";

export const productService = {
	// Get all products
	async getAllProducts() {
		const querySnapshot = await getDocs(collection(db, "products"));
		const products = [];
		querySnapshot.forEach(doc => {
			products.push({ id: doc.id, ...doc.data() });
		});
		return products;
	},

	// Get product by ID
	async getProductById(productId) {
		const docRef = doc(db, "products", productId);
		const docSnap = await getDoc(docRef);

		if (docSnap.exists()) {
			return { id: docSnap.id, ...docSnap.data() };
		} else {
			return null;
		}
	},

	// Add new product
	async addProduct(productData) {
		const docRef = await addDoc(collection(db, "products"), productData);
		return docRef.id;
	},

	// Update product
	async updateProduct(productId, productData) {
		const docRef = doc(db, "products", productId);
		await updateDoc(docRef, productData);
		return true;
	},

	// Delete product
	async deleteProduct(productId) {
		await deleteDoc(doc(db, "products", productId));
		return true;
	},

	// Check if product exists by ID
	async productExists(productId) {
		const q = query(collection(db, "products"), where("id", "==", productId));
		const querySnapshot = await getDocs(q);
		return !querySnapshot.empty;
	},

	// Get all existing product IDs
	async getExistingProductIds() {
		const querySnapshot = await getDocs(collection(db, "products"));
		const existingIds = [];
		querySnapshot.forEach(doc => {
			const data = doc.data();
			if (data.id) {
				existingIds.push(data.id);
			}
		});
		return existingIds;
	},

	// Batch import products (skip duplicates)
	async batchImportProducts(products) {
		const batch = writeBatch(db);
		const results = {
			success: 0,
			skipped: 0,
			errors: [],
			total: products.length,
		};

		// Get existing product IDs
		const existingIds = await this.getExistingProductIds();

		for (const product of products) {
			try {
				// Check if product already exists
				if (existingIds.includes(product.id)) {
					results.skipped++;
					continue;
				}

				// Add new product
				const docRef = doc(collection(db, "products"));
				batch.set(docRef, {
					...product,
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
				});
				results.success++;
			} catch (error) {
				results.errors.push({
					product: product.name,
					error: error.message,
				});
			}
		}

		await batch.commit();
		return results;
	},
};
