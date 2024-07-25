import Loading from "@/components/Loading";
import SidebarDashboard from "@/components/SidebarDashboard";
import withAdminAuth from "@/utils/adminAuthorization";
import axiosInstance from "@/utils/axiosInstance";
import { secondaryColor, white } from "@/utils/color";
import formatDate from "@/utils/formatDate";
import formatTime from "@/utils/formatTime";
import {
  AddIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  InfoIcon,
} from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useBreakpointValue,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const PresensiSiswa = () => {
  const router = useRouter();
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const toast = useToast();
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const now = new Date();
  // +7 FROM NOW
  const nowIndonesian = new Date(now.getTime() + 7 * 60 * 60 * 1000);

  const { id } = router.query;

  const handleKehadiranChange = async (id, tanggal, kehadiran, tipe) => {
    try {
      const response = await axiosInstance.put(`/admin/presensi/${id}`, {
        kehadiran,
        tanggal,
        tipe,
      });
      console.log(response);
      toast({
        title: response.data.message,
        status: "info",
        position: "bottom-right",
        isClosable: true,
      });
      fetchData();
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
    setData(null);
    try {
      const response = await axiosInstance.get(`/admin/siswa/${id}`, {
        params: { tipe: router.query.tipe },
      });
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (router.isReady) {
      fetchData();
    }
  }, [router.query.tipe, router.isReady]);

  const handleTipeChange = (newTipe) => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, tipe: newTipe },
    });
  };

  if (loading) return <Loading />;

  return (
    <>
      <SidebarDashboard>
        <Flex direction={"column"} gap={5} w={"100%"}>
          <VStack
            justifyContent={"space-between"}
            alignContent={"center"}
            alignItems={"start"}
          >
            <Heading>{data?.data?.nama}</Heading>
            <Text fontSize={"2xl"}>
              {data?.data?.kelas} - {data?.data?.idSiswa}
            </Text>
          </VStack>
          <HStack>
            <Select
              maxW={"200px"}
              
              value={router.query.tipe ? router.query.tipe : ""}
              onChange={(e) => handleTipeChange(e.target.value)}
            >
              <option value=""> Semua</option>
              <option value="MASUK">Masuk</option>F
              <option value="KELUAR">Keluar</option>
            </Select>
          </HStack>
          <Box bg={"white"} rounded={"md"} p={2} color={"teal"} maxW={"600px"}>
            <HStack dir="row" gap={6}>
              <HStack>
                <Text>Hadir:</Text>
                <Text> {data?.data?.totalKehadiran?.H}</Text>
              </HStack>
              <HStack>
                <Text color={secondaryColor}>Ijin:</Text>
                <Text color={secondaryColor}> {data?.data?.totalKehadiran?.I}</Text>
              </HStack>
              <HStack>
                <Text color={"red"}>Alpa:</Text>
                <Text color={"red"}> {data?.data?.totalKehadiran?.A}</Text>
              </HStack>
              <HStack>
                <Text color={"blueviolet"}>Sakit:</Text>
                <Text color={"blueviolet"}> {data?.data?.totalKehadiran?.S}</Text>
              </HStack>
            </HStack>
          </Box>
          <TableContainer>
            <Table>
              <Thead>
                <Tr>
                  <Th>No</Th>
                  <Th>Kehadiran</Th>
                  <Th>Tipe</Th>
                  <Th>Waktu</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {data?.data?.kehadiran?.map((item, index) => (
                  <Tr key={item.index}>
                    <Td>{index + 1}</Td>
                    <Td>
                      {item.kehadiran == "H"
                        ? "Hadir"
                        : item.kehadiran == "S"
                        ? "Sakit"
                        : item.kehadiran == "I"
                        ? "Izin"
                        : item.kehadiran == "A"
                        ? "Alpa"
                        : "-"}
                    </Td>
                    <Td>{item.tipe}</Td>
                    <Td>
                      <Text>{item.waktu ? formatDate(item.waktu) : "-"}</Text>
                      <Text>{item.waktu ? formatTime(item.waktu) : ""}</Text>
                    </Td>
                    <Td>
                      <Select
                        value={item.kehadiran}
                        onChange={(e) =>
                          handleKehadiranChange(
                            item.idSiswa,
                            item.waktu,
                            e.target.value,
                            item.tipe
                          )
                        }
                        placeholder="Belum"
                      >
                        <option value="H">Hadir</option>
                        <option value="S">Sakit</option>
                        <option value="I">Izin</option>
                        <option value="A">Alpa</option>
                      </Select>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Flex>
      </SidebarDashboard>
    </>
  );
};

export default withAdminAuth(PresensiSiswa);
