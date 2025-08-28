// Components
import AuthenticationSignInForm from '../components/AuthenticationSignInForm.vue';
import AuthenticationSignInRoleSelection from '../components/AuthenticationSignInRoleSelection.vue';

export const AUTHENTICATION_SIGN_IN_STEPPER = [
  {
    id: 'role-selection',
    component: AuthenticationSignInRoleSelection,
    title: 'Role Selection',
  },
  {
    id: 'form',
    component: AuthenticationSignInForm,
    title: 'Sign In',
  },
];
