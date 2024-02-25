import {
  Box,
  Flex,
  Icon,
  Text,
  Input,
  Drawer,
  Button,
  BoxProps,
  FlexProps,
  IconButton,
  InputGroup,
  CloseButton,
  DrawerContent,
  useDisclosure,
  InputRightElement,
  useColorModeValue,
} from "@chakra-ui/react";
import { Outlet } from "react-router";
import { FiMenu } from "react-icons/fi";
import { IconType } from "react-icons";
import { useNavigate } from "react-router-dom";
import { ContactContext } from "./ContactContext";
import { FunctionComponent, ReactText, useContext, useState } from "react";

export const Root: FunctionComponent = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
      />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav display={{ base: "flex", md: "none" }} onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        <Outlet />
      </Box>
    </Box>
  );
};

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const {
    total,
    contacts,
    handleFetch,
    setSearch: setContactSearch,
  } = useContext(ContactContext);

  const handleClick = (contactId: string) => () => {
    onClose();
    navigate(`/contacts/${contactId}`);
  };

  const handleNewContact = () => {
    onClose();
    navigate("/contacts/new");
  };

  const handleSearch = () => {
    setContactSearch(search);
  };

  const handleLoadOneMore = () => {
    handleFetch(true);
  };

  return (
    <Box
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Button onClick={handleNewContact}>New</Button>
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      <InputGroup size="md">
        <Input
          pr="4.5rem"
          placeholder="Contact name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <InputRightElement width="4.5rem">
          <Button h="1.75rem" size="sm" onClick={handleSearch}>
            Search
          </Button>
        </InputRightElement>
      </InputGroup>
      {contacts.map((contact) => (
        <NavItem
          key={contact.data().name}
          icon={null as any}
          onClick={handleClick(contact.id)}
        >
          {contact.data().name}
        </NavItem>
      ))}
      <Button width="100%" onClick={handleLoadOneMore}>
        Load one more of {total}
      </Button>
    </Box>
  );
};

interface NavItemProps extends FlexProps {
  icon: IconType;
  children: ReactText;
}
const NavItem = ({ icon, children, ...rest }: NavItemProps) => {
  return (
    <Box
      as="a"
      href="#"
      style={{ textDecoration: "none" }}
      _focus={{ boxShadow: "none" }}
    >
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: "cyan.400",
          color: "white",
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: "white",
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Box>
  );
};

interface MobileProps extends FlexProps {
  onOpen: () => void;
}

const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 24 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent="flex-start"
      {...rest}
    >
      <IconButton
        variant="outline"
        onClick={onOpen}
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text fontSize="2xl" ml="8" fontFamily="monospace" fontWeight="bold">
        Contact App
      </Text>
    </Flex>
  );
};
