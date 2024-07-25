import Loading from "@/components/Loading";
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
import { useEffect, useState } from "react";

const Edit = () => {
  const [idSiswa, setIdSiswa] = useState("");
  const [nama, setNama] = useState("");
  const [kelas, setKelas] = useState("");
  const [noOrangTua, setNoOrangTua] = useState("");
  const toast = useToast();
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/admin/siswa/${id}`);
      setIdSiswa(response.data.data.idSiswa);
      setNama(response.data.data.nama);
      setKelas(response.data.data.kelas);
      setNoOrangTua(response.data.data.noOrangtua);
      console.log(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (router.isReady) {
      fetchData();
    }
  }, []);

  const handleAdd = async () => {
    try {
      const response = await axiosInstance.put(`/admin/siswa/${id}`, {
        updatedId: idSiswa,
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
  if (loading) return <Loading />;
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
          <Heading mb={6}>Edit Data Siswa</Heading>
          <FormControl mb={4}>
            <FormLabel>NIS</FormLabel>
            <Input
              type="number"
              placeholder="Masukkan NIS"
              onChange={(e) => setIdSiswa(e.target.value)}
              value={idSiswa}
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Nama</FormLabel>
            <Input
              type="text"
              placeholder="Masukkan Nama"
              onChange={(e) => setNama(e.target.value)}
              value={nama}
            />
          </FormControl>
          <FormControl mb={6}>
            <FormLabel>Kelas</FormLabel>
            <Input
              type="text"
              placeholder="Masukkan Kelas"
              onChange={(e) => setKelas(e.target.value)}
              value={kelas}
            />
          </FormControl>
          <FormControl mb={6}>
            <FormLabel>No. Telp Orang Tua / Wali</FormLabel>
            <Input
              type="number"
              placeholder="8xxxxxxxxx"
              onChange={(e) => setNoOrangTua(e.target.value)}
              value={noOrangTua}
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

export default withAdminAuth(Edit);
