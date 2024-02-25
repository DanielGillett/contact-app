import {
  Box,
  Text,
  Stack,
  Avatar,
  Button,
  Center,
  Heading,
  useColorModeValue,
} from "@chakra-ui/react";
import { FunctionComponent, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ContactContext } from "./ContactContext";

export const ContactDetails: FunctionComponent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contact, setContact] = useState<any>();
  const { getContactById, deleteContact } = useContext(ContactContext);

  const handleEdit = () => navigate(`/contacts/${id}/edit`);
  const handleDelete = async () => {
    await deleteContact(id!);
    navigate(`/`);
  };
  const handleFetch = async () => {
    const newContact = await getContactById(id!);
    setContact(newContact);
  };

  useEffect(() => {
    handleFetch();
  }, [id]);

  return (
    <Center py={6}>
      <Box
        maxW={"320px"}
        w={"full"}
        bg={useColorModeValue("white", "gray.900")}
        boxShadow={"2xl"}
        rounded={"lg"}
        p={6}
        textAlign={"center"}
      >
        <Avatar
          size={"xl"}
          src={
            "https://images.unsplash.com/photo-1520810627419-35e362c5dc07?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ"
          }
          mb={4}
          pos={"relative"}
          _after={{
            content: '""',
            w: 4,
            h: 4,
            bg: "green.300",
            border: "2px solid white",
            rounded: "full",
            pos: "absolute",
            bottom: 0,
            right: 3,
          }}
        />
        <Heading fontSize={"2xl"} fontFamily={"body"}>
          {contact?.name}
        </Heading>

        <Text
          textAlign={"center"}
          color={useColorModeValue("gray.700", "gray.400")}
          px={3}
        >
          {contact?.description}
        </Text>
        <Stack mt={8} direction={"row"} spacing={4}>
          <Button
            flex={1}
            fontSize={"sm"}
            rounded={"full"}
            _focus={{
              bg: "gray.200",
            }}
            onClick={handleEdit}
          >
            Edit
          </Button>
          <Button
            flex={1}
            fontSize={"sm"}
            rounded={"full"}
            bg={"red.400"}
            color={"white"}
            boxShadow={
              "0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)"
            }
            _hover={{
              bg: "red.500",
            }}
            _focus={{
              bg: "red.500",
            }}
            onClick={handleDelete}
          >
            Delete
          </Button>
        </Stack>
      </Box>
    </Center>
  );
};
