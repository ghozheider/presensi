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
import { useRouter } from "next/router";
import { useState } from "react";

const Tambah = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const toast = useToast();
  const router = useRouter();

  const handleAdd = async () => {
    try {
      const response = await axiosInstance.post("/admin/petugas", {
        email,
        nama: name,
        password,
      });
      toast({
        title: response.data.message,
        status: "info",
        position: "bottom-right",
        isClosable: true,
      });
      router.push("/admin/petugas");
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
          <Heading mb={6}>Tambah Data Petugas</Heading>
          <FormControl mb={4}>
            <FormLabel>Nama</FormLabel>
            <Input
              placeholder="Masukkan nama"
              onChange={(e) => setName(e.target.value)}
              value={name}
              _placeholder={{ opacity: 0.5, color: "gray.500", fontsize: 12 }}
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              placeholder="Masukkan email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              _placeholder={{ opacity: 0.5, color: "gray.500", fontsize: 12 }}
            />
          </FormControl>
          <FormControl mb={6}>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              placeholder="Masukkan password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
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
              handleAdd();
            }}
          >
            Simpan
          </Button>
        </Flex>
      </Flex>
    </SidebarDashboard>
  );
};

export default withAdminAuth(Tambah);
