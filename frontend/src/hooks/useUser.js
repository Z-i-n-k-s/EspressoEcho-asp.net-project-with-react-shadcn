// hooks/useUser.js
import { useSelector } from 'react-redux';

export const useUser = () => {
  const user = useSelector((state) => state.user.user);
  const role = useSelector((state) => state.user.role);
  
  return { user, role };
};

export default useUser;