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
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const Presensi = () => {
  const router = useRouter();
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const toast = useToast();
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const [kelas, setKelas] = useState([]);
  const now = new Date();
  // +7 FROM NOW
  const nowIndonesian = new Date(now.getTime() + 7 * 60 * 60 * 1000);

  const handleKehadiranChange = async (id, kehadiran) => {
    try {
      const response = await axiosInstance.put(`/admin/presensi/${id}`, {
        kehadiran,
        tanggal: router.query.date || nowIndonesian.toISOString().split("T")[0],
        tipe: router.query.tipe || "MASUK",
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

  const makeAllPresensiHadir = async () => {
    try {
      const response = await axiosInstance.post(`/admin/presensi`, {
        tanggal: router.query.date || nowIndonesian.toISOString().split("T")[0],
        tipe: router.query.tipe || "MASUK",
      });
      toast({
        title: response.data.message,
        status: "info",
        position: "bottom-right",
        isClosable: true,
      });
      fetchData();
      setIsConfirmationOpen(false);
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
      const response = await axiosInstance.get("/admin/presensi", {
        params: {
          kelas: router.query.kelas,
          date: router.query.date,
          tipe: router.query.tipe,
        },
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
  }, [
    router.query.kelas,
    router.isReady,
    router.query.date,
    router.query.tipe,
  ]);

  const fetchKelas = async () => {
    try {
      const response = await axiosInstance.get("/admin/kelas");
      setKelas(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchKelas();
  }, []);

  const handleKelasChange = (newKelas) => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, kelas: newKelas },
    });
  };

  const handleTipeChange = (newTipe) => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, tipe: newTipe },
    });
  };

  const handleDateChange = (newDate) => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, date: newDate },
    });
  };

  const ConfirmationModal = () => {
    return (
      <Modal
        isOpen={isConfirmationOpen}
        onClose={() => {
          setIsConfirmationOpen(false);
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Konfirmasi Tindakan</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Apakah anda yakin ingin membuat hadir untuk yang belum presensi?
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="gray"
              mr={3}
              onClick={() => {
                setIsConfirmationOpen(false);
              }}
            >
              Tutup
            </Button>
            <Button
              colorScheme={"teal"}
              onClick={() => {
                makeAllPresensiHadir();
              }}
            >
              Konfirmasi
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };

  if (loading) return <Loading />;

  return (
    <>
      <SidebarDashboard>
        <Flex direction={"column"} gap={5} w={"100%"}>
          <HStack justifyContent={"space-between"} alignContent={"center"}>
            <Heading>Daftar Presensi</Heading>
            <Button
              onClick={() => {
                setIsConfirmationOpen(true);
              }}
              bg={"teal.400"}
              color={"white"}
              outline={"2px solid teal.400"}
              leftIcon={<InfoIcon />}
              _hover={{ bg: "white", color: "teal.400" }}
            >
              Buat Hadir
            </Button>
          </HStack>
          <HStack>
            <Select
              maxW={"200px"}
              placeholder="Pilih Kelas"
              value={router.query.kelas}
              onChange={(e) => handleKelasChange(e.target.value)}
            >
              {kelas?.map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
            </Select>
            <Select
              maxW={"200px"}
              placeholder="Pilih Tipe"
              value={router.query.tipe ? router.query.tipe : "MASUK"}
              onChange={(e) => handleTipeChange(e.target.value)}
            >
              <option value="MASUK">Masuk</option>
              <option value="KELUAR">Keluar</option>
            </Select>
            <Input
              type="date"
              maxW={"200px"}
              value={
                router.query.date
                  ? router.query.date
                  : now.toISOString().split("T")[0]
              }
              onChange={(e) => handleDateChange(e.target.value)}
            />
          </HStack>
          <Box bg={"white"} rounded={"md"} p={2} color={"teal"} maxW={"600px"}>
            <HStack dir="row" gap={6}>
              <HStack>
                <Text>Hadir:</Text>
                <Text> {data?.presensi?.H}</Text>
              </HStack>
              <HStack>
                <Text color={secondaryColor}>Ijin:</Text>
                <Text color={secondaryColor}> {data?.presensi?.I}</Text>
              </HStack>
              <HStack>
                <Text color={"red"}>Alpa:</Text>
                <Text color={"red"}> {data?.presensi?.A}</Text>
              </HStack>
              <HStack>
                <Text color={"blueviolet"}>Sakit:</Text>
                <Text color={"blueviolet"}> {data?.presensi?.S}</Text>
              </HStack>
              <HStack>
                <Text color={"black"}>Belum:</Text>
                <Text color={"black"}> {data?.presensi?.TK}</Text>
              </HStack>

            </HStack>
          </Box>

          <TableContainer>
            <Table>
              <Thead>
                <Tr>
                  <Th>No</Th>
                  <Th>Nama</Th>
                  <Th>Kelas</Th>
                  <Th>Kehadiran</Th>
                  <Th>Waktu</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.data.map((item, index) => (
                  <Tr key={item.index}>
                    <Td>{index + 1}</Td>
                    <Td>
                      <Text as={"b"}>{item.siswa.nama}</Text>
                      <Text>{item.siswa.idSiswa}</Text>
                    </Td>
                    <Td>{item.siswa.kelas}</Td>
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
                    <Td>
                      <Text>{item.waktu ? formatDate(item.waktu) : "-"}</Text>
                      <Text>{item.waktu ? formatTime(item.waktu) : ""}</Text>
                    </Td>
                    <Td>
                      <Select
                        value={item.kehadiran}
                        onChange={(e) =>
                          handleKehadiranChange(
                            item.siswa.idSiswa,
                            e.target.value
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
      <ConfirmationModal />
    </>
  );
};

export default withAdminAuth(Presensi);
