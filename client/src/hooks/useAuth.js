// Thin re-export so pages can `import { useAuth } from '../hooks/useAuth'`
// per the project's stated architecture, without duplicating context logic.
export { useAuth } from '../context/AuthContext';
