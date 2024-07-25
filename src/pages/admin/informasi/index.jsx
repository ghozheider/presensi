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
  Select,
  HStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Informasi = () => {
  const [tahunAjaran, setTahunAjaran] = useState("");
  const [tahunAjaran2, setTahunAjaran2] = useState("");
  const [semester, setSemester] = useState("");
  const toast = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const handleEdit = async () => {
    try {
      const response = await axiosInstance.put("/admin/informasi", {
        tahunAjaran: `${tahunAjaran}/${tahunAjaran2}`,
        semester,
      });
      toast({
        title: response.data.message,
        status: "info",
        position: "bottom-right",
        isClosable: true,
      });
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

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/admin/informasi");
      const splitTahunAjaran = response.data.data.tahunAjaran.split("/");
      setTahunAjaran(splitTahunAjaran[0]);
      setTahunAjaran2(splitTahunAjaran[1]);      
      setSemester(response.data.data.semester);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (router.isReady) {
      fetchData();
    }
  }, [router.isReady]);

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
          <Heading mb={6}>Informasi Tahun Ajaran</Heading>
          <FormControl mb={4}>
            <FormLabel>Tahun Ajaran</FormLabel>            
            <HStack>
              <Input
                type="number"
                placeholder="Tahun Ajaran"
                onChange={(e) => setTahunAjaran(e.target.value)}
                value={tahunAjaran}
              />
              <Input
                type="number"
                placeholder="Tahun Ajaran"
                onChange={(e) => setTahunAjaran2(e.target.value)}
                value={tahunAjaran2}                
              />
            </HStack>
          </FormControl>
          <FormControl mb={6}>
            <FormLabel>Semester</FormLabel>
            <Select
              onChange={(e) => setSemester(e.target.value)}
              value={semester}
            >
              <option value="GANJIL">Ganjil</option>
              <option value="GENAP">Genap</option>
            </Select>
          </FormControl>

          <Button
            color={"white"}
            bg={"teal.400"}
            _hover={{
              bg: "teal.300",
            }}
            onClick={() => {
              handleEdit();
            }}
          >
            Simpan
          </Button>
        </Flex>
      </Flex>
    </SidebarDashboard>
  );
};

export default withAdminAuth(Informasi);
