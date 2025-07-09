import { db } from "../firebase";
import {
	collection,
	getDocs,
	doc,
	getDoc,
	addDoc,
	updateDoc,
	deleteDoc,
} from "firebase/firestore";

export const productService = {
	// Get all products
	async getAllProducts() {
		try {
			const querySnapshot = await getDocs(collection(db, "products"));
			const products = [];
			querySnapshot.forEach(doc => {
				products.push({ id: doc.id, ...doc.data() });
			});
			return products;
		} catch (error) {
			console.error("Error getting products:", error);
			throw error;
		}
	},

	// Get product by ID
	async getProductById(productId) {
		try {
			const docRef = doc(db, "products", productId);
			const docSnap = await getDoc(docRef);

			if (docSnap.exists()) {
				return { id: docSnap.id, ...docSnap.data() };
			} else {
				return null;
			}
		} catch (error) {
			console.error("Error getting product:", error);
			throw error;
		}
	},

	// Add new product
	async addProduct(productData) {
		try {
			const docRef = await addDoc(collection(db, "products"), productData);
			return docRef.id;
		} catch (error) {
			console.error("Error adding product:", error);
			throw error;
		}
	},

	// Update product
	async updateProduct(productId, productData) {
		try {
			const docRef = doc(db, "products", productId);
			await updateDoc(docRef, productData);
			return true;
		} catch (error) {
			console.error("Error updating product:", error);
			throw error;
		}
	},

	// Delete product
	async deleteProduct(productId) {
		try {
			await deleteDoc(doc(db, "products", productId));
			return true;
		} catch (error) {
			console.error("Error deleting product:", error);
			throw error;
		}
	},
};
