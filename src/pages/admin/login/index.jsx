import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Text,
  Heading,
  Stack,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  FormControl,
  FormLabel,
  useToast,
} from "@chakra-ui/react";

import Footer from "@/components/footer";
import { useRouter } from "next/router";
import React, { useState } from "react";
import axiosInstance from "@/utils/axiosInstance";

const Login = () => {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (email === "" || password === "") {
      toast({
        title: "Field Tidak Boleh Kosong",
        status: "error",
        position: "bottom-right",
        isClosable: true,
      });
      return;
    }
    try {
      const response = await axiosInstance.post("/admin/login", {
        email,
        password,
      });
      const token = response?.data?.token;
      localStorage.setItem("token", token);
      toast({
        title: response.data.message,
        status: "info",
        position: "bottom-right",
        isClosable: true,
      });
      router.push("/admin/dashboard");
    } catch (error) {
      console.error(error);
      // FOR PETUGAS
      try {
        const response = await axiosInstance.post("/petugas/login", {
          email,
          password,
        });
        const token = response?.data?.token;
        localStorage.setItem("token", token);
        toast({
          title: response.data.message,
          status: "info",
          position: "bottom-right",
          isClosable: true,
        });
        router.push("/presensi");
      } catch (error) {
        console.error(error);
        toast({
          title: error?.response?.data?.message,
          status: "error",
          position: "bottom-right",
          isClosable: true,
        });
      }
    }
  };

  return (
    <div>
      <div
        className="h-[93vh] flex items-center justify-center"
        style={{
          backgroundImage: "url('/images/bg-login.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Card
          maxW={{ base: "90%", sm: "sm", md: "md", lg: "lg", xl: "xl" }}
          w={{
            base: "100%",
            sm: "100%",
            md: "400px",
            lg: "400px",
            xl: "400px",
          }}
        >
          <CardBody display="flex" flexDirection="column" alignItems="center">
            <Image
              src="/images/login-img.jpg"
              width="400px"
              height="200px"
              objectFit={"cover"}
              alt="Green double couch with wooden legs"
              borderRadius="lg"
            />
            <Stack mt="5" width="100%">
              <Heading size="md" textAlign="center">
                Login untuk Presensi
              </Heading>
              <div className="mt-3">
                <FormControl>
                  <FormLabel fontSize="sm" color="#333">
                    Email address
                  </FormLabel>
                  <Input
                    type="email"
                    placeholder="Masukkan Email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    _placeholder={{
                      opacity: 0.5,
                      color: "gray.500",
                      fontsize: 12,
                    }}
                  />
                </FormControl>
                <FormControl mt="3">
                  <FormLabel fontSize="sm">Password</FormLabel>
                  <InputGroup size="md">
                    <Input
                      pr="4.5rem"
                      type={show ? "text" : "password"}
                      placeholder="Masukkan password"
                      onChange={(e) => setPassword(e.target.value)}
                      value={password}
                      _placeholder={{
                        opacity: 0.5,
                        color: "gray.500",
                        fontsize: 12,
                      }}
                    />
                    <InputRightElement width="4.5rem">
                      <Button h="1.75rem" size="sm" onClick={handleClick}>
                        {show ? "Hide" : "Show"}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
              </div>
            </Stack>
          </CardBody>
          <CardFooter
            display="flex"
            flexDirection="column"
            alignItems="end"
            mt="-5"
          >
            <Button
              variant="solid"
              colorScheme="blue"
              onClick={() => handleLogin()}
            >
              Login
            </Button>
          </CardFooter>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
