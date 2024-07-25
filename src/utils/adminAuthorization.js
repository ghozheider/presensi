import { useRouter } from "next/router";
import { useEffect, useState, createContext } from "react";
import { useToast } from "@chakra-ui/react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

const withAdminAuth = (Component) => {
  const AuthenticatedComponent = (props) => {
    const router = useRouter();
    const [userData, setUserData] = useState(null);
    const toast = useToast();

    useEffect(() => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/");
      } else {
        try {
          const payload = jwtDecode(token);
          if (!payload.idAdmin) {
            router.push("/");
            console.log(168);
          } else if (payload.exp < Date.now() / 1000) {
            toast({
              title: "Session has expired",
              status: "warning",
              position: "bottom-right",
              isClosable: true,
            });
            router.push("/");
          } else {
            setUserData(payload);
          }
        } catch (error) {
          console.error("Error decoding token:", error);
          router.push("/");
        }
      }
    }, [router, toast]);

    return (
      <AuthContext.Provider value={userData}>
        <Component {...props} />
      </AuthContext.Provider>
    );
  };

  AuthenticatedComponent.displayName = `withAdminAuth(${
    Component.displayName || Component.name || "Component"
  })`;

  return AuthenticatedComponent;
};

export default withAdminAuth;
