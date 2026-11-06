import { createRouter, createWebHistory } from "vue-router";
import { config } from "@/config";
import HomePage from "@/pages/HomePage.vue";
import { useAuthStore } from "@/stores/auth";

const s = config.school.shortName;
const base = `RYL ${s}`;

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      component: HomePage,
      meta: { title: `Rate Your Landlord - ${s}` },
      path: "/",
    },
    {
      component: () => import("@/pages/LandlordProfilePage.vue"),
      path: "/landlord/:id",
    },
    {
      component: () => import("@/pages/AddLandlordPage.vue"),
      meta: { requiresAuth: true, title: `Add Landlord - ${base}` },
      path: "/landlord/add",
    },
    {
      component: () => import("@/pages/AddReviewPage.vue"),
      meta: { requiresAuth: true, title: `Add Review - ${base}` },
      path: "/review/add",
    },
    {
      component: () => import("@/pages/EditReviewPage.vue"),
      meta: { requiresAuth: true, title: `Edit Review - ${base}` },
      path: "/review/:id/edit",
    },
    {
      component: () => import("@/pages/LoginPage.vue"),
      meta: { title: `Sign In - ${base}` },
      path: "/login",
    },
    {
      component: () => import("@/pages/RegisterPage.vue"),
      meta: { title: `Sign Up - ${base}` },
      path: "/register",
    },
    {
      component: () => import("@/pages/ResetPasswordPage.vue"),
      meta: { title: `Reset Password - ${base}` },
      path: "/reset-password",
    },
    {
      component: () => import("@/pages/VerifyEmailPage.vue"),
      meta: { title: `Verify Email - ${base}` },
      path: "/verify-email",
    },
    {
      component: () => import("@/pages/NewPasswordPage.vue"),
      meta: { title: `Set New Password - ${base}` },
      path: "/new-password",
    },
    {
      component: () => import("@/pages/ResourcesPage.vue"),
      meta: { title: `Resources - ${base}` },
      path: "/resources",
    },
    {
      component: () => import("@/pages/AboutPage.vue"),
      meta: { title: `About - ${base}` },
      path: "/about",
    },
    {
      component: () => import("@/pages/ContactPage.vue"),
      meta: { title: `Contact - ${base}` },
      path: "/contact",
    },
    {
      component: () => import("@/pages/PrivacyPage.vue"),
      meta: { title: `Privacy Policy - ${base}` },
      path: "/privacy",
    },
    {
      component: () => import("@/pages/TermsPage.vue"),
      meta: { title: `Terms of Service - ${base}` },
      path: "/terms",
    },
    {
      component: () => import("@/pages/admin/EditLandlordPage.vue"),
      meta: { requiresAdmin: true, title: `Edit Landlord - ${base}` },
      path: "/admin/landlord/:id/edit",
    },
    {
      component: () => import("@/pages/SettingsPage.vue"),
      meta: { requiresAuth: true, title: `Settings - ${base}` },
      path: "/settings",
    },
    {
      component: () => import("@/pages/admin/DashboardPage.vue"),
      meta: { requiresAdmin: true, title: `Admin - ${base}` },
      path: "/admin",
    },
    { path: "/admin/:pathMatch(.*)*", redirect: "/admin" },
    {
      component: () => import("@/pages/admin/ReviewsPage.vue"),
      meta: { requiresAdmin: true, title: `Reviews - ${base}` },
      path: "/admin/landlord/:id/reviews",
    },
    {
      component: () => import("@/pages/NotFoundPage.vue"),
      meta: { title: `Not Found - ${base}` },
      path: "/:pathMatch(.*)*",
    },
  ],
  scrollBehavior: () => ({ top: 0 }),
});

const guestOnly = ["/login", "/register", "/reset-password"];

router.beforeEach(async (to) => {
  document.title = (to.meta?.title as string) ?? base;

  const auth = useAuthStore();

  await auth.waitUntilReady();

  if (guestOnly.includes(to.path) && auth.isLoggedIn) {
    return { path: "/" };
  }

  if (to.meta?.requiresAdmin && !auth.isAdmin) {
    return auth.isLoggedIn
      ? { path: "/" }
      : { path: "/login", query: { redirect: to.fullPath } };
  }
  if (to.meta?.requiresAuth && !auth.isLoggedIn) {
    return { path: "/login", query: { redirect: to.fullPath } };
  }
});

export default router;
