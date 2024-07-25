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
  const [idSiswa, setIdSiswa] = useState("");
  const [nama, setNama] = useState("");
  const [kelas, setKelas] = useState("");
  const [noOrangTua, setNoOrangTua] = useState("");
  const toast = useToast();
  const router = useRouter();

  const handleAdd = async () => {
    try {
      const response = await axiosInstance.post("/admin/siswa", {
        idSiswa,
        nama,
        kelas,
        noOrangTua,
      });
      toast({
        title: response.data.message,
        status: "info",
        position: "bottom-right",
        isClosable: true,
      });
      router.push("/admin/siswa");
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
          <Heading mb={6}>Tambah Data Siswa</Heading>
          <FormControl mb={4}>
            <FormLabel>NIS</FormLabel>
            <Input
              type="number"
              placeholder="Masukkan NIS"
              onChange={(e) => setIdSiswa(e.target.value)}
              value={idSiswa}
              _placeholder={{ opacity: 0.5, color: "gray.500", fontsize: 12 }}
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Nama</FormLabel>
            <Input
              type="text"
              placeholder="Masukkan Nama"
              onChange={(e) => setNama(e.target.value)}
              value={nama}
              _placeholder={{ opacity: 0.5, color: "gray.500", fontsize: 12 }}
            />
          </FormControl>
          <FormControl mb={6}>
            <FormLabel>Kelas</FormLabel>
            <Input
              type="text"
              placeholder="Masukkan Kelas"
              onChange={(e) => setKelas(e.target.value)}
              value={kelas}
              _placeholder={{ opacity: 0.5, color: "gray.500", fontsize: 12 }}
            />
          </FormControl>
          <FormControl mb={6}>
            <FormLabel>No. Telp Orang Tua / Wali</FormLabel>
            <Input
              type="number"
              placeholder="8xxxxxxxxx"
              onChange={(e) => setNoOrangTua(e.target.value)}
              value={noOrangTua}
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
