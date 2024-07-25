import SidebarDashboard from "@/components/SidebarDashboard";
import {
  Heading,
  Card,
  CardBody,
  Stack,
  Text,
  Flex,
  Box,
  SimpleGrid,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { FaUsers, FaUserGroup } from "react-icons/fa6";
import { FaDoorClosed } from "react-icons/fa";
import LoadingComponent from "@/components/LoadingComponent";
import axiosInstance from "@/utils/axiosInstance";
import formatDate from "@/utils/formatDate";
import { useRouter } from "next/router";
import withAdminAuth from "@/utils/adminAuthorization";

const Dashboard = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();
  const [kehadiran, setKehadiran] = useState();
  const now = new Date();

  const nowIndonesian = new Date(now.getTime() + 7 * 60 * 60 * 1000);

  const fetchKehadiran = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/admin/presensi", {
        params: {
          date: nowIndonesian.toISOString().split("T")[0],
        },
      });
      setKehadiran(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/admin/dashboard");
      setData(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (router.isReady) {
      fetchData();
      fetchKehadiran();
    }
  }, [router.isReady]);

  return (
    <SidebarDashboard>
      <Flex flexDirection={"column"} width={"full"} gap={10}>
        <Heading>Dashboard</Heading>
        <Flex
          flexDirection={"row"}
          alignItems={"start"}
          justifyContent={"space-around"}
        >
          <Flex flexDirection="column" gap={10}>
            <Card
              overflow="hidden"
              width={{ base: "100%" }}
              variant="outline"
              _hover={{ borderColor: "teal.100" }}
            >
              <Stack>
                <CardBody
                  cursor={"pointer"}
                  onClick={() => router.push("/admin/presensi")}
                >
                  <Flex
                    flexDirection={{ base: "column", md: "column" }}
                    gap={10}
                    alignItems="center"
                    justifyContent={"space-between"}
                  >
                    {loading ? (
                      <LoadingComponent mx="320" my="10" />
                    ) : (
                      <>
                        <Box>
                          <Heading size="lg">Presensi Siswa Hari Ini</Heading>
                          <Text mt={3} textAlign={"center"} fontSize={"18px"}>
                            Tanggal {formatDate(nowIndonesian)}
                          </Text>
                        </Box>
                        <Flex
                          flexDirection="row"
                          alignItems="center"
                          width="700px"
                          justifyContent="space-around"
                          bg="teal.500"
                          p={6}
                          rounded="lg"
                        >
                          <Flex
                            flexDirection="column"
                            alignItems="center"
                            gap={5}
                          >
                            <Text
                              fontWeight={500}
                              color="white"
                              fontSize={"20px"}
                            >
                              Hadir
                            </Text>
                            <Text color="white" fontSize="24px">
                              {kehadiran?.presensi?.H}
                            </Text>
                          </Flex>
                          <Flex
                            flexDirection="column"
                            alignItems="center"
                            gap={5}
                          >
                            <Text
                              fontWeight={500}
                              color="white"
                              fontSize={"20px"}
                            >
                              Sakit
                            </Text>
                            <Text color="white" fontSize="24px">
                              {kehadiran?.presensi?.S}
                            </Text>
                          </Flex>
                          <Flex
                            flexDirection="column"
                            alignItems="center"
                            gap={5}
                          >
                            <Text
                              fontWeight={500}
                              color="white"
                              fontSize={"20px"}
                            >
                              Izin
                            </Text>
                            <Text color="white" fontSize="24px">
                              {kehadiran?.presensi?.I}
                            </Text>
                          </Flex>
                          <Flex
                            flexDirection="column"
                            alignItems="center"
                            gap={5}
                          >
                            <Text
                              fontWeight={500}
                              color="white"
                              fontSize={"20px"}
                            >
                              Belum
                            </Text>
                            <Text color="white" fontSize="24px">
                              {kehadiran?.presensi?.TK}
                            </Text>
                          </Flex>
                        </Flex>
                      </>
                    )}
                  </Flex>
                </CardBody>
              </Stack>
            </Card>

            {/* review absensi */}
          </Flex>
          <Flex flexDirection="column" gap={10}>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
              <Card
                overflow="hidden"
                variant="outline"
                _hover={{ borderColor: "teal.100" }}
                onClick={() => router.push("/admin/siswa")}
                cursor={"pointer"}
                width={"auto"}
              >
                {loading ? (
                  <LoadingComponent mx="55" my="20" />
                ) : (
                  <>
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      justifyContent="center"
                      mt="10px"
                      p={5}
                    >
                      <FaUsers size="2em" />
                    </Box>
                    <Stack>
                      <CardBody>
                        <Heading size="md">Jumlah Siswa</Heading>
                        <Text py={2}>{data?.totalSiswa} Siswa</Text>
                      </CardBody>
                    </Stack>
                  </>
                )}
              </Card>

              <Card
                overflow="hidden"
                variant="outline"
                _hover={{ borderColor: "teal.100" }}
                onClick={() => router.push("/admin/presensi")}
                cursor={"pointer"}
              >
                {loading ? (
                  <LoadingComponent m="auto" />
                ) : (
                  <>
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      justifyContent="center"
                      mt="10px"
                      p={5}
                    >
                      <FaDoorClosed size="2em" />
                    </Box>
                    <Stack>
                      <CardBody>
                        <Heading size="md">Jumlah Kelas</Heading>
                        <Text py={2}>{data?.totalKelas} Kelas</Text>
                      </CardBody>
                    </Stack>
                  </>
                )}
              </Card>
              <Card
                overflow="hidden"
                variant="outline"
                _hover={{ borderColor: "teal.100" }}
                onClick={() => router.push("/admin/petugas")}
                cursor={"pointer"}
              >
                {loading ? (
                  <LoadingComponent m="auto" />
                ) : (
                  <>
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      justifyContent="center"
                      mt="10px"
                      p={5}
                    >
                      <FaUserGroup size="2em" />
                    </Box>
                    <Stack>
                      <CardBody>
                        <Heading size="md">Jumlah Petugas</Heading>
                        <Text py={2}>{data?.totalPetugas} Petugas</Text>
                      </CardBody>
                    </Stack>
                  </>
                )}
              </Card>
            </SimpleGrid>

            {/* review absensi */}
          </Flex>
        </Flex>
      </Flex>
    </SidebarDashboard>
  );
};

export default withAdminAuth(Dashboard);
