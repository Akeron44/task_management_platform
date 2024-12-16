import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import routes from "../../../constants/routes";
import signupService, { SignupCredentials } from "../services/signupService";
import { UserResponse } from "../../Login/types/LoginCredentials";
import error_messages from "../../../constants/error_messages";
import { openNotification } from "../../../helpers/handleNotification";

const useSignup = () => {
  const navigate = useNavigate();
  return useMutation<UserResponse, Error, SignupCredentials>({
    mutationFn: async (user: SignupCredentials) => {
      const userData = await signupService.authenticate(user);

      if (!userData) {
        throw new Error(error_messages.AUTHENTICATION_FAILED);
      }

      return userData;
    },
    onSuccess: (userData: UserResponse) => {
      const { token, ...user } = userData;
      localStorage.setItem("token", JSON.stringify(token));
      localStorage.setItem("user", JSON.stringify(user));
      navigate(routes.ROOT);
      return user;
    },
    onError(error) {
      openNotification({
        type: "error",
        title: "Error",
        message: error.message,
      });
    },
  });
};

export default useSignup;
