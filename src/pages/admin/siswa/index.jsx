import Loading from "@/components/Loading";
import SidebarDashboard from "@/components/SidebarDashboard";
import withAdminAuth from "@/utils/adminAuthorization";
import axiosInstance from "@/utils/axiosInstance";
import { secondaryColor, white } from "@/utils/color";
import formatDate from "@/utils/formatDate";
import {
  AddIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ExternalLinkIcon,
  InfoIcon,
} from "@chakra-ui/icons";
import {
  Button,
  Center,
  Flex,
  Heading,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
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
import { Modak } from "next/font/google";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import QRCode from "react-qr-code";

const Siswa = () => {
  const totalButton = useBreakpointValue({ base: 1, lg: 3 }, { fallback: 1 });
  const router = useRouter();
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [idSiswa, setIdSiswa] = useState(null);
  const toast = useToast();
  const [kelas, setKelas] = useState([]);
  const [isQROpen, setIsQROpen] = useState(false);
  const [nama, setNama] = useState("");

  const handleQRClose = () => {
    setIsQROpen(false);
    setNama("");
    setIdSiswa(null);
  };

  const fetchData = async () => {
    setData(null);
    setLoading(true);
    try {
      const response = await axiosInstance.get("/admin/siswa", {
        params: {
          page: router.query.page || 1,
          kelas: router.query.kelas,
        },
      });
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

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

  const deleteData = async (id) => {
    try {
      const response = await axiosInstance.delete(`/admin/siswa/${id}`);
      toast({
        title: response?.data?.message,
        status: "info",
        position: "bottom-right",
        isClosable: true,
      });
      fetchData();
      setIsConfirmationOpen(false);
      setIdSiswa(null);
    } catch (error) {
      toast({
        title: error?.response?.data?.message,
        status: "error",
        position: "bottom-right",
        isClosable: true,
      });
      console.error(error);
    }
  };

  const ConfirmationModal = (id) => {
    return (
      <Modal
        isOpen={isConfirmationOpen}
        onClose={() => {
          setIsConfirmationOpen(false);
          setIdSiswa(null);
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Konfirmasi Hapus</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Apakah anda yakin ingin menghapus data ini?</Text>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="gray"
              mr={3}
              onClick={() => {
                setIsConfirmationOpen(false);
                setIdSiswa(null);
              }}
            >
              Close
            </Button>
            <Button colorScheme={"red"} onClick={() => deleteData(idSiswa)}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };

  const handlePageChange = (newPage) => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, page: newPage },
    });
  };

  const handleKelasChange = (newKelas) => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, kelas: newKelas },
    });
  };

  useEffect(() => {
    if (router.isReady) {
      fetchData();
    }
  }, [router.query.page, router.isReady, router.query.kelas]);

  if (loading) return <Loading />;

  return (
    <>
      <SidebarDashboard>
        <Flex direction={"column"} gap={5} w={"100%"}>
          <HStack justifyContent={"space-between"} alignContent={"center"}>
            <Heading>Siswa</Heading>
            <Button
              onClick={() => router.push("/admin/siswa/tambah")}
              colorScheme={"teal"}
              variant={"outline"}
              leftIcon={<AddIcon />}
              _hover={{ bg: "teal.500", color: "white" }}
            >
              Tambah Data
            </Button>
          </HStack>
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
          <TableContainer>
            <Table>
              <Thead>
                <Tr>
                  <Th>No</Th>
                  <Th>Nama</Th>
                  <Th>Kelas</Th>
                  <Th>No Orangtua</Th>
                  <Th>Dibuat Pada</Th>
                  <Th></Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {data?.data?.map((item, index) => (
                  <Tr key={item.idSiswa}>
                    <Td>{index + 1}</Td>
                    <Td>
                      <Text as={"b"}>{item.nama}</Text>
                      <Text>{item.idSiswa}</Text>
                    </Td>
                    <Td>{item.kelas}</Td>
                    <Td>
                      +62{item.noOrangtua}{" "}
                      <a
                        href={`https://wa.me/62${item.noOrangtua}`}
                        target={"_blank"}
                      >
                        <ExternalLinkIcon />
                      </a>
                    </Td>
                    <Td>{formatDate(item.createdAt)}</Td>
                    <Td>
                      <Button
                        colorScheme={"teal"}
                        onClick={() =>
                          router.push(`/admin/siswa/${item.idSiswa}`)
                        }
                        m={2}
                      >
                        Edit
                      </Button>
                      <Button
                        colorScheme={"red"}
                        onClick={() => {
                          setIsConfirmationOpen(true);
                          setIdSiswa(item.idSiswa);
                        }}
                        m={2}
                      >
                        Delete
                      </Button>
                      <Button
                        colorScheme={"gray"}
                        m={2}
                        onClick={() =>
                          router.push(`/admin/siswa/presensi/${item.idSiswa}`)
                        }
                      >
                        Presensi
                      </Button>
                    </Td>
                    <Td>
                      <InfoIcon
                        onClick={() => {
                          setIsQROpen(true);
                          setNama(item.nama);
                          setIdSiswa(item.idSiswa);
                        }}
                      />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
          {data?.pagination?.total_page > 0 ? (
            <HStack mt={4} mx={"auto"}>
              <Button
                variant="outline"
                colorScheme="teal"
                onClick={() =>
                  handlePageChange(data.pagination.current_page - 1)
                }
                isDisabled={data?.pagination?.current_page === 1}
              >
                <ArrowLeftIcon />
              </Button>
              {data?.pagination?.current_page > 3 && (
                <>
                  <Button
                    variant="outline"
                    colorScheme="teal"
                    onClick={() => handlePageChange(1)}
                  >
                    1
                  </Button>
                  {data?.pagination?.current_page > 4 && <Text>...</Text>}
                </>
              )}
              {Array.from(
                { length: totalButton },
                (_, index) => data?.pagination?.current_page - 0 + index
              )
                .filter(
                  (pageNumber) =>
                    pageNumber > 0 && pageNumber <= data?.pagination?.total_page
                )
                .map((pageNumber) => (
                  <Button
                    key={pageNumber}
                    variant={
                      data?.pagination?.current_page === pageNumber
                        ? "solid"
                        : "outline"
                    }
                    colorScheme="teal"
                    onClick={() => handlePageChange(pageNumber)}
                  >
                    {pageNumber}
                  </Button>
                ))}
              {data?.pagination?.current_page <
                data?.pagination?.total_page - 2 && (
                <>
                  {data?.pagination?.current_page <
                    data?.pagination?.total_page - 3 && <Text>...</Text>}
                  <Button
                    variant="outline"
                    colorScheme="teal"
                    onClick={() =>
                      handlePageChange(data?.pagination?.total_page)
                    }
                  >
                    {data?.pagination?.total_page}
                  </Button>
                </>
              )}
              <Button
                variant="outline"
                colorScheme="teal"
                onClick={() =>
                  handlePageChange(data.pagination.current_page + 1)
                }
                isDisabled={
                  data?.pagination?.current_page ===
                  data?.pagination?.total_page
                }
              >
                <ArrowRightIcon />
              </Button>
            </HStack>
          ) : null}
        </Flex>
      </SidebarDashboard>
      <ConfirmationModal />
      <ModalQR isQROpen={isQROpen} idSiswa={idSiswa} nama={nama} onClose={handleQRClose} />
    </>
  );
};

const ModalQR = ({ nama, idSiswa, isQROpen, onClose }) => {
  return (
    <Modal isOpen={isQROpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{nama}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack>
            <QRCode value={idSiswa} />
            <Text fontSize={"lg"}>
              NIS: {idSiswa}
            </Text>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="gray" mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
export default withAdminAuth(Siswa);
