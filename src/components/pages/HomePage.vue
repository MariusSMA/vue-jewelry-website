<template>
	<section class="home">
		<Hero />
		<Partners />
		<Accessories />
		<FAQ />
		<Newsletter />
		<Footer />
	</section>
</template>

<script>
import Hero from "../HeroComponent.vue";
import Partners from "../PartnersComponent.vue";
import Accessories from "../AccessoriesComponent.vue";
import FAQ from "../FAQ.vue";
import Newsletter from "../NewsletterComponent.vue";
import Footer from "../FooterComponent.vue";

export default {
	name: "HomePage",
	components: {
		Hero,
		Partners,
		Accessories,
		FAQ,
		Newsletter,
		Footer,
	},
};
</script>
