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
  CheckIcon,
  CloseIcon,
  ExternalLinkIcon,
} from "@chakra-ui/icons";
import {
  Box,
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
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  useBreakpointValue,
  useToast,
} from "@chakra-ui/react";
import { Modak } from "next/font/google";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const Management = () => {
  const totalButton = useBreakpointValue({ base: 1, lg: 3 }, { fallback: 1 });
  const router = useRouter();
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const toast = useToast();

  const fetchData = async () => {
    setData(null);
    setLoading(true);
    try {
      const response = await axiosInstance.get("/admin/management", {
        params: {
          page: router.query.page || 1,
        },
      });
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);      
    }
  };

  const deleteData = async (id) => {
    try {
      const response = await axiosInstance.delete(`/admin/management/${id}`);
      toast({
        title: response?.data?.message,
        status: "info",
        position: "bottom-right",
        isClosable: true,
      });
      fetchData();
      setIsConfirmationOpen(false);
      setDeleteId(null);
    } catch (error) {
      toast({
        title: error?.response?.data?.message,
        status: "error",
        position: "bottom-right",
        isClosable: true,
      });
      console.error(error);
      setDeleteId(null);
      setIsConfirmationOpen(false);
    }
  };

  const ConfirmationModal = (id) => {
    return (
      <Modal
        isOpen={isConfirmationOpen}
        onClose={() => {
          setIsConfirmationOpen(false);
          setDeleteId(null);
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
                setDeleteId(null);
              }}
            >
              Close
            </Button>
            <Button colorScheme={"red"} onClick={() => deleteData(deleteId)}>
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

  useEffect(() => {
    if (router.isReady) {
      fetchData();
    }
  }, [router.query.page, router.isReady]);

  if (loading) return <Loading />;

  return (
    <>
      <SidebarDashboard>
        <Flex direction={"column"} gap={5} w={"100%"}>
          <HStack justifyContent={"space-between"} alignContent={"center"}>
            <Heading>Admin</Heading>
            <Button
              onClick={() => router.push("/admin/management/tambah")}
              colorScheme={"teal"}
              variant={"outline"}
              leftIcon={<AddIcon />}
              _hover={{ bg: "teal.500", color: "white" }}
            >
              Tambah Data
            </Button>
          </HStack>
          <TableContainer>
            <Table>
              <Thead>
                <Tr>
                  <Th>No</Th>
                  <Th>Email</Th>
                  <Th>Super Admin</Th>
                  <Th>Dibuat Pada</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {data?.data?.map((item, index) => (
                  <Tr key={item.idAdmin}>
                    <Td>{index + 1}</Td>
                    <Td>{item.email}</Td>
                    <Td>
                      {item.isSuperAdmin ? (
                        <Tooltip label="Super Admin">
                          <CheckIcon />
                        </Tooltip>
                      ) : (
                        <Tooltip label="Bukan Super Admin">
                          <CloseIcon />
                        </Tooltip>
                      )}
                    </Td>
                    <Td>{formatDate(item.createdAt)}</Td>
                    <Td>
                      <Button
                        colorScheme={"red"}
                        onClick={() => {
                          setIsConfirmationOpen(true);
                          setDeleteId(item.idAdmin);
                        }}
                      >
                        Delete
                      </Button>
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
    </>
  );
};

export default withAdminAuth(Management)
