import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextInput, Box, rem } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';

export default function SearchBar() {
  const [inputValue, setInputValue] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (inputValue.trim() !== "") {
      navigate(`/products?search=${inputValue.trim()}`);
    } else {
      navigate("/products");
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearch();
    }
  };

  return (
    <Box
      style={{
        position: "relative",
        width: rem(390),
      }}
    >
      <TextInput
        placeholder="Keresés..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        radius="md"
        size="md"
        styles={{
          input: {
            width: "100%",
            height: rem(40),
            backgroundColor: "#F3F4F6",
            borderRadius: rem(8),
            border: "1px solid #ccc",
            paddingLeft: rem(12),
            paddingRight: rem(40),
            fontSize: rem(14),
            color: "#333",
            outline: "none",
          },
        }}
      />
      {/* Kereső ikon a jobb oldalon */}
      <IconSearch
        onClick={handleSearch}
        size={20}
        style={{
          position: "absolute",
          top: "50%",
          right: rem(12),
          transform: "translateY(-50%)",
          color: "#A0A0A0",
          cursor: "pointer",
        }}
      />
    </Box>
  );
}