import { Box, Spinner } from "@chakra-ui/react";

const LoadingComponent = ({ ...props }) => {
  return (
    <>
      <Spinner size="lg" {...props} />
    </>
  );
};

export default LoadingComponent;
