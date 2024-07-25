import SidebarDashboard from "@/components/SidebarDashboard";
import withAdminAuth from "@/utils/adminAuthorization";
import axiosInstance from "@/utils/axiosInstance";
import {
  FormControl,
  FormLabel,
  Input,
  Flex,
  Heading,
  Button,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";

const Profile = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const toast = useToast();

  const handleChangePassword = async () => {
    if (oldPassword === "" || newPassword === "" || confirmPassword === "") {
      toast({
        title: "Field Tidak Boleh Kosong",
        status: "error",
        position: "bottom-right",
        isClosable: true,
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Password Tidak Sama",
        status: "error",
        position: "bottom-right",
        isClosable: true,
      });
      return;
    }
    try {
      const response = await axiosInstance.put("/admin/password", {
        old_password: oldPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      toast({
        title: response.data.message,
        status: "info",
        position: "bottom-right",
        isClosable: true,
      });
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error(error);
      toast({
        title: error.response.data.message,
        status: "error",
        position: "bottom-right",
        isClosable: true,
      });
    }
  };

  return (
    <SidebarDashboard>
      <Flex
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
        margin="auto"
      >
        <Flex
          flexDirection="column"
          p={10}
          borderRadius="md"
          boxShadow="md"
          bg="white"
          w="800px"
          maxW="90%"
        >
          <Heading mb={6} textAlign={"center"}>
            Edit Password
          </Heading>
          <FormControl mb={6}>
            <FormLabel>Password Lama</FormLabel>
            <Input
              type="password"
              placeholder="Masukkan password lama"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              _placeholder={{ opacity: 0.5, color: "gray.500", fontsize: 12 }}
            />
          </FormControl>
          <FormControl mb={6}>
            <FormLabel>Password Baru</FormLabel>
            <Input
              type="password"
              placeholder="Masukkan password baru"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              _placeholder={{ opacity: 0.5, color: "gray.500", fontsize: 12 }}
            />
          </FormControl>
          <FormControl mb={6}>
            <FormLabel>Konfirmasi Password</FormLabel>
            <Input
              type="password"
              placeholder="Konfirmasi password baru"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              _placeholder={{ opacity: 0.5, color: "gray.500", fontsize: 12 }}
            />
          </FormControl>

          <Button
            color={"white"}
            bg={"teal.400"}
            _hover={{
              bg: "teal.300",
            }}
            onClick={() => {
              handleChangePassword();
            }}
          >
            Simpan
          </Button>
        </Flex>
      </Flex>
    </SidebarDashboard>
  );
};

export default withAdminAuth(Profile);
