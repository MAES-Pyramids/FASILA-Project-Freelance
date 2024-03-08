// src/router.js or src/router.ts
import { createRouter, createWebHistory } from "vue-router";
import Store from "@/Store";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Home",
      component: () => import("../views/HomeView.vue"),
      beforeEnter: (to, from, next) => {
        const isAuthenticated = Store.getters["auth/authenticated"];
        const userRole = isAuthenticated
          ? Store.getters["auth/user"].role
          : null;

        if (isAuthenticated && userRole === "Student") {
          // Allow Students to enter
          next();
        } else if (isAuthenticated && userRole === "Admin") {
          // Redirect Admin to Admin Dashboard
          next("/Admin");
        } else if (isAuthenticated && userRole === "Doctor") {
          // Redirect Doctor to Doctor Dashboard
          next("/Doctor");
        } else if (!isAuthenticated) {
          // Redirect unauthenticated users to login
          next("/login");
        } else {
          // For any other role (e.g., "Doctor"), prevent access
          next(false);
        }
      },
    },
    // !Login
    {
      path: "/login",
      name: "login",
      component: () => import("../views/LoginView.vue"),
      beforeEnter: (to, from, next) => {
        const isAuthenticated = Store.getters["auth/authenticated"];
        const userRole = isAuthenticated
          ? Store.getters["auth/user"].role
          : null;

        if (isAuthenticated && userRole === "Student") {
          // Redirect Students to Home
          next("/");
        } else if (isAuthenticated && userRole === "Admin") {
          // Redirect Admin to Admin Dashboard
          next("/Admin");
        } else if (isAuthenticated && userRole === "Doctor") {
          // Redirect Doctor to Doctor Dashboard
          next("/Doctor");
        } else if (!isAuthenticated) {
          // Allow unauthenticated users to enter
          next();
        } else {
          // For any other role (e.g., "Doctor"), prevent access
          next(false);
        }
      },
    },
    // !ForceLogin
    {
      path: "/Login/ForceLogin",
      name: "forceLogin",
      component: () => import("../views/ForceLoginView.vue"),
      beforeEnter: (to, from, next) => {
        const isAuthenticated = Store.getters["auth/authenticated"];
        const userRole = isAuthenticated
          ? Store.getters["auth/user"].role
          : null;

        if (isAuthenticated && userRole === "Student") {
          // Redirect Students to Home
          next("/");
        } else if (isAuthenticated && userRole === "Admin") {
          // Redirect Admin to Admin Dashboard
          next("/Admin");
        } else if (isAuthenticated && userRole === "Doctor") {
          // Redirect Doctor to Doctor Dashboard
          next("/Doctor");
        } else if (!isAuthenticated) {
          // Allow unauthenticated users to enter
          next();
        } else {
          // For any other role (e.g., "Doctor"), prevent access
          next(false);
        }
      },
    },
    // !Register
    {
      path: "/register",
      name: "register",
      component: () => import("../views/RegisterView.vue"),
      beforeEnter: (to, from, next) => {
        const isAuthenticated = Store.getters["auth/authenticated"];
        const userRole = isAuthenticated
          ? Store.getters["auth/user"].role
          : null;

        if (isAuthenticated && userRole === "Student") {
          // Redirect Students to Home
          next("/");
        } else if (isAuthenticated && userRole === "Admin") {
          // Redirect Admin to Admin Dashboard
          next("/Admin");
        } else if (isAuthenticated && userRole === "Doctor") {
          // Redirect Doctor to Doctor Dashboard
          next("/Doctor");
        } else if (!isAuthenticated) {
          // Allow unauthenticated users to enter
          next();
        } else {
          // For any other role (e.g., "Doctor"), prevent access
          next(false);
        }
      },
    },
    // !Forget Password
    {
      path: "/forgetPassword",
      name: "forgetPassword",
      component: () => import("../views/ForgetPasswordView.vue"),
      beforeEnter: (to, from, next) => {
        const isAuthenticated = Store.getters["auth/authenticated"];
        const userRole = isAuthenticated
          ? Store.getters["auth/user"].role
          : null;

        if (isAuthenticated && userRole === "Student") {
          // Redirect Students to Home
          next("/");
        } else if (isAuthenticated && userRole === "Admin") {
          // Redirect Admin to Admin Dashboard
          next("/Admin");
        } else if (isAuthenticated && userRole === "Doctor") {
          // Redirect Doctor to Doctor Dashboard
          next("/Doctor");
        } else if (!isAuthenticated) {
          // Allow unauthenticated users to enter
          next();
        } else {
          // For any other role (e.g., "Doctor"), prevent access
          next(false);
        }
      },
    },
    // !Reset Password
    {
      path: "/resetPassword",
      name: "resetPassword",
      component: () => import("../views/ResetPasswordView.vue"),
      beforeEnter: (to, from, next) => {
        const isAuthenticated = Store.getters["auth/authenticated"];
        const userRole = isAuthenticated
          ? Store.getters["auth/user"].role
          : null;

        if (isAuthenticated && userRole === "Student") {
          // Redirect Students to Home
          next("/");
        } else if (isAuthenticated && userRole === "Admin") {
          // Redirect Admin to Admin Dashboard
          next("/Admin");
        } else if (isAuthenticated && userRole === "Doctor") {
          // Redirect Doctor to Doctor Dashboard
          next("/Doctor");
        } else if (!isAuthenticated) {
          // Allow unauthenticated users to enter
          next();
        } else {
          // For any other role (e.g., "Doctor"), prevent access
          next(false);
        }
      },
    },
    // !doctor
    {
      path: "/Doctors/:DoctorId",
      name: "Doctors",
      component: () => import("../views/DoctorSubjectView.vue"),
      beforeEnter: [
        (to, from, next) => {
          const isAuthenticated = Store.getters["auth/authenticated"];
          const userRole = isAuthenticated
            ? Store.getters["auth/user"].role
            : null;
          if (isAuthenticated && userRole === "Student") {
            // Allow Students to enter
            next();
          } else if (isAuthenticated && userRole === "Admin") {
            // Redirect Admin to Admin Dashboard
            next("/Admin");
          } else if (isAuthenticated && userRole === "Doctor") {
            // Redirect Doctor to Doctor Dashboard
            next("/Doctor");
          } else if (!isAuthenticated) {
            // Redirect unauthenticated users to login
            next("/login");
          } else {
            // For any other role (e.g., "Doctor"), prevent access
            next(false);
          }
        },
        (to, from, next) => {
          const DoctorId = atob(to.params.DoctorId);
          to.params.DoctorId = DoctorId;
          next();
        },
      ],
    },
    // !Lectures
    {
      path: "/Doctors/:DoctorId/Lectures/:LectureId",
      name: "Lectures",
      component: () => import("../views/LecturesView.vue"),
      beforeEnter: [
        (to, from, next) => {
          const isAuthenticated = Store.getters["auth/authenticated"];
          const userRole = isAuthenticated
            ? Store.getters["auth/user"].role
            : null;
          if (isAuthenticated && userRole === "Student") {
            // Allow Students to enter
            next();
          } else if (isAuthenticated && userRole === "Admin") {
            // Redirect Admin to Admin Dashboard
            next("/Admin");
          } else if (isAuthenticated && userRole === "Doctor") {
            // Redirect Doctor to Doctor Dashboard
            next("/Doctor");
          } else if (!isAuthenticated) {
            // Redirect unauthenticated users to login
            next("/login");
          } else {
            // For any other role (e.g., "Doctor"), prevent access
            next(false);
          }
        },
        (to, from, next) => {
          const DoctorId = atob(to.params.DoctorId);
          to.params.DoctorId = DoctorId;
          const LectureId = atob(to.params.LectureId);
          to.params.LectureId = LectureId;
          next();
        },
      ],
    },
    // !PDF
    {
      path: "/pdf/:LectureIdToEdit",
      name: "pdf",
      component: () => import("../views/PDFView.vue"),
      props: (route) => ({ pdfLink: route.query.pdfLink }),
      beforeEnter: (to, from, next) => {
        const isAuthenticated = Store.getters["auth/authenticated"];
        const userRole = isAuthenticated
          ? Store.getters["auth/user"].role
          : null;
        if (isAuthenticated && userRole === "Student") {
          // Allow Students to enter
          next();
        } else if (isAuthenticated && userRole === "Admin") {
          // Redirect Admin to Admin Dashboard
          next("/Admin");
        } else if (isAuthenticated && userRole === "Doctor") {
          // Redirect Doctor to Doctor Dashboard
          next("/Doctor");
        } else if (!isAuthenticated) {
          // Redirect unauthenticated users to login
          next("/login");
        } else {
          // For any other role (e.g., "Doctor"), prevent access
          next(false);
        }
      },
    },
    // !Admin
    {
      path: "/Admin",
      name: "Admin",
      component: () => import("../Admin/Dashboard/DashboardView.vue"),
      beforeEnter: (to, from, next) => {
        const isAuthenticated = Store.getters["auth/authenticated"];
        const userRole = isAuthenticated
          ? Store.getters["auth/user"].role
          : null;
        if (isAuthenticated && userRole === "Admin") {
          // Allow Admin to enter
          next();
        } else if (isAuthenticated && userRole === "Student") {
          // Redirect Students to Home
          next("/");
        } else if (isAuthenticated && userRole === "Doctor") {
          // Redirect Doctor to Doctor Dashboard
          next("/Doctor");
        } else if (!isAuthenticated) {
          // Redirect unauthenticated users to login
          next("/login");
        } else {
          // For any other role (e.g., "Doctor"), prevent access
          next(false);
        }
      },
    },
    // !Admin/Subjects
    {
      path: "/Admin/Subjects",
      name: "AdminSubjects",
      component: () => import("../Admin/Subjects/SubjectsAdmin.vue"),
      beforeEnter: (to, from, next) => {
        const isAuthenticated = Store.getters["auth/authenticated"];
        const userRole = isAuthenticated
          ? Store.getters["auth/user"].role
          : null;
        if (isAuthenticated && userRole === "Admin") {
          // Allow Admin to enter
          next();
        } else if (isAuthenticated && userRole === "Student") {
          // Redirect Students to Home
          next("/");
        } else if (isAuthenticated && userRole === "Doctor") {
          // Redirect Doctor to Doctor Dashboard
          next("/Doctor");
        } else if (!isAuthenticated) {
          // Redirect unauthenticated users to login
          next("/login");
        } else {
          // For any other role (e.g., "Doctor"), prevent access
          next(false);
        }
      },
    },

    // !Doctor
    {
      path: "/Doctor",
      name: "Doctor",
      component: () => import("../views/Doctor/DoctorView.vue"),
      beforeEnter: (to, from, next) => {
        const isAuthenticated = Store.getters["auth/authenticated"];
        const userRole = isAuthenticated
          ? Store.getters["auth/user"].role
          : null;
        if (isAuthenticated && userRole === "Doctor") {
          // Allow Doctor to enter
          next();
        } else if (isAuthenticated && userRole === "Student") {
          // Redirect Students to Home
          next("/");
        } else if (isAuthenticated && userRole === "Admin") {
          // Redirect Admin to Admin Dashboard
          next("/Admin");
        } else if (!isAuthenticated) {
          // Redirect unauthenticated users to login
          next("/login");
        } else {
          // For any other role (e.g., "Admin"), prevent access
          next(false);
        }
      },
    },
    // !ADD SUBJECT
    {
      path: "/Doctor/AddSubject",
      name: "AddSubject",
      component: () => import("../views/Doctor/AddSubjectView.vue"),
      beforeEnter: (to, from, next) => {
        const isAuthenticated = Store.getters["auth/authenticated"];
        const userRole = isAuthenticated
          ? Store.getters["auth/user"].role
          : null;
        if (isAuthenticated && userRole === "Doctor") {
          // Allow Doctor to enter
          next();
        } else if (isAuthenticated && userRole === "Student") {
          // Redirect Students to Home
          next("/");
        } else if (isAuthenticated && userRole === "Admin") {
          // Redirect Admin to Admin Dashboard
          next("/Admin");
        } else if (!isAuthenticated) {
          // Redirect unauthenticated users to login
          next("/login");
        } else {
          // For any other role (e.g., "Admin"), prevent access
          next(false);
        }
      },
    },
    // !ADD EARNINGS
    {
      path: "/Doctor/ShowEarnings",
      name: "ShowEarnings",
      component: () => import("../views/Doctor/ShowEarningsView.vue"),
      beforeEnter: (to, from, next) => {
        const isAuthenticated = Store.getters["auth/authenticated"];
        const userRole = isAuthenticated
          ? Store.getters["auth/user"].role
          : null;
        if (isAuthenticated && userRole === "Doctor") {
          // Allow Doctor to enter
          next();
        } else if (isAuthenticated && userRole === "Student") {
          // Redirect Students to Home
          next("/");
        } else if (isAuthenticated && userRole === "Admin") {
          // Redirect Admin to Admin Dashboard
          next("/Admin");
        } else if (!isAuthenticated) {
          // Redirect unauthenticated users to login
          next("/login");
        } else {
          // For any other role (e.g., "Admin"), prevent access
          next(false);
        }
      },
    },
    // !Doctor Profile
    {
      path: "/Doctor/Profile",
      name: "DoctorProfile",
      component: () => import("../views/Doctor/DoctorProfileView.vue"),
      beforeEnter: (to, from, next) => {
        const isAuthenticated = Store.getters["auth/authenticated"];
        const userRole = isAuthenticated
          ? Store.getters["auth/user"].role
          : null;
        if (isAuthenticated && userRole === "Doctor") {
          // Allow Doctor to enter
          next();
        } else if (isAuthenticated && userRole === "Student") {
          // Redirect Students to Home
          next("/");
        } else if (isAuthenticated && userRole === "Admin") {
          // Redirect Admin to Admin Dashboard
          next("/Admin");
        } else if (!isAuthenticated) {
          // Redirect unauthenticated users to login
          next("/login");
        } else {
          // For any other role (e.g., "Admin"), prevent access
          next(false);
        }
      },
    },
  ],
});

export default router;
