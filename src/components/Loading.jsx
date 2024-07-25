import { Center, Spinner, VStack } from "@chakra-ui/react";

const Loading = () => {
  return (
    <>
      <VStack
        position="fixed"
        top="0"
        left="0"
        bottom="0"
        right="0"
        zIndex="9999"
        justifyContent="center"
        alignItems="center"
      >
        <Center>
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
        </Center>
      </VStack>
    </>
  );
}

export default Loading