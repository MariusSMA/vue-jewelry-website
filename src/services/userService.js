import { db } from "../firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

export const userService = {
	// Get user profile from Firestore
	async getUserProfile(userId) {
		const docRef = doc(db, "users", userId);
		const docSnap = await getDoc(docRef);

		if (docSnap.exists()) {
			return { id: docSnap.id, ...docSnap.data() };
		} else {
			return null;
		}
	},

	// Create user profile when they first register
	async createUserProfile(userId, userData) {
		const userProfile = {
			email: userData.email,
			role: "user", // Default role
			displayName: userData.displayName || null,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			...userData,
		};

		await setDoc(doc(db, "users", userId), userProfile);
		return userProfile;
	},

	// Update user role (for making someone admin)
	async updateUserRole(userId, role) {
		const docRef = doc(db, "users", userId);
		await updateDoc(docRef, {
			role: role,
			updatedAt: new Date().toISOString(),
		});
		return true;
	},

	// Check if user is admin
	async isUserAdmin(userId) {
		try {
			const userProfile = await this.getUserProfile(userId);
			return userProfile && userProfile.role === "admin";
		} catch (error) {
			return false;
		}
	},

	// Update user profile information
	async updateUserProfile(userId, updates) {
		const docRef = doc(db, "users", userId);
		await updateDoc(docRef, {
			...updates,
			updatedAt: new Date().toISOString(),
		});
		return true;
	},
};
