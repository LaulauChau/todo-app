<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

import AuthForm from "~/components/AuthForm.vue";

const route = useRoute();
const formType = computed(() => (route.params.type === "login" ? "login" : "register"));
</script>

<template>
  <AuthForm :type="formType" />
</template>
