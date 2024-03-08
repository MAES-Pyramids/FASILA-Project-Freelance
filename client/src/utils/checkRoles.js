import Store from "../Store";

const checkRoles = (to, from, next) => {
  const isAuthenticated = Store.getters["auth/authenticated"];
  const userRole = isAuthenticated ? Store.getters["auth/user"].role : null;

  if (!isAuthenticated) {
    // Redirect unauthenticated users to login
    next("/login");
  } else if (userRole === "Admin") {
    // Redirect Admin to Admin Dashboard
    next("/Admin");
  } else if (userRole === "Doctor") {
    // Redirect Doctor to Doctor Dashboard
    next("/Doctor");
  } else if (userRole === "Student") {
    // Allow Students to enter
    next();
  } else {
    // For any other role, prevent access
    next(false);
  }
};

export default checkRoles;
