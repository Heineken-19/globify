import { useEffect, useState } from "react";
import { ActionIcon, rem, Transition } from "@mantine/core";
import { IconArrowUp } from "@tabler/icons-react";
import { useModal } from "../context/ModalContext";



export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);
  const { isModalOpen } = useModal();

  // Görgetés figyelése
  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Transition mounted={visible && !isModalOpen} transition="slide-up" duration={200} timingFunction="ease">
      {(styles) => (
        <ActionIcon
          variant="filled"
          color="green"
          size="lg"
          radius="xl"
          style={{
            ...styles,
            position: "fixed",
            bottom: rem(20),
            right: rem(20),
            zIndex: 9999,
          }}
          onClick={scrollToTop}
        >
          <IconArrowUp size={20} />
        </ActionIcon>
      )}
    </Transition>
  );
}
