import { useState, JSX, useEffect } from "react";
import { Modal, Image, Button, Text, Collapse, Group, Table, Stack } from "@mantine/core";
import { IconPlant, IconLeaf, IconWind, IconPaw, IconSun, IconDroplet, IconTag, IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { useProduct } from "../hooks/useProducts";
import { ProductModalProps } from "../types";
import { API_URL } from '../config/config';
import ReviewModal from './ReviewModal';
import { useMediaQuery } from '@mantine/hooks';
import { useModal } from "../context/ModalContext";


export default function ProductModal({ productId, opened, onClose, addToCart }: ProductModalProps) {
  const { data: product, isLoading, error } = useProduct(productId);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [expanded, setExpanded] = useState<boolean>(false);
  const [showReviews, setShowReviews] = useState(false);
  const { setModalOpen } = useModal();
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    setModalOpen(opened); // amikor nyitva van, állítsd be
  }, [opened]);

  if (!productId || isLoading) return null;
  if (error) return <Text color="red">{error.message}</Text>;


  const imageUrls: string[] =
    product?.imageUrls && product.imageUrls.length > 0
      ? product.imageUrls.map((imgPath) => `${API_URL}/uploads/products/${imgPath}`)
      : [`${API_URL}/uploads/products/default.jpg`];


  const typeIcons: Record<string, JSX.Element> = {
    "Állónövény": <IconPlant size={25} />,
    "Futó növény": <IconLeaf size={25} />,
    "Levegő tisztító": <IconWind size={25} />,
    "Állatbarát": <IconPaw size={25} />,
  };


  const hasLight = !!product?.light;
  const hasWater = !!product?.water;
  const hasExtra = !!product?.extra;
  const hasFact = !!product?.fact;

  const showDetails = hasLight || hasWater || hasExtra || hasFact;

  return (
    <Modal opened={opened} onClose={onClose} size={isMobile ? "100%" : "80%"} fullScreen={isMobile} withCloseButton={false} centered
      styles={{
        content: {
          top: isMobile ? '20x' : '65px',
          padding: isMobile ? '30px' : '10px',
          marginTop: isMobile ? '110px' : '50px',
          maxHeight: isMobile ? '95vh' : 'unset',
          overflowY: isMobile ? 'auto' : 'unset',
        }
      }}
    >
      <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: isMobile ? "20px" : "40px", justifyContent: "center", alignItems: "center" }}>

        <Button
          onClick={onClose}
          variant="subtle"
          color="gray"
          size="m"
          style={{
            position: "absolute",
            top: isMobile ? '15px' : '1px',
            right: 0,
            zIndex: 10,
            padding: "10px 20px",
            fontSize: "14px",
          }}
        >
          ✕
        </Button>

        <div className="image-slider" style={{ width: isMobile ? "100%" : "500px", height: isMobile ? "auto" : "500px" }}>
          {imageUrls.length > 0 && (
            <div className="slider-container" style={{ position: "relative" }}>
              <button
                className="prev-btn"
                onClick={() =>
                  setCurrentImageIndex((prev) => (prev - 1 + imageUrls.length) % imageUrls.length)
                }
                style={{
                  position: "absolute",
                  top: "50%",
                  left: 10,
                  transform: "translateY(-50%)",
                  zIndex: 3,
                  background: "rgba(255,255,255,0.7)",
                  border: "none",
                  borderRadius: "50%",
                  padding: 8,
                  cursor: "pointer",
                }}
              >
                <IconChevronLeft size={18} />
              </button>
              <Image src={imageUrls[currentImageIndex]} alt={product?.name || "Termékkép"} fit="contain" width={isMobile ? "100%" : 500} height={isMobile ? 250 : 500} />
              <button
                className="next-btn"
                onClick={() => setCurrentImageIndex((prev) => (prev + 1) % imageUrls.length)}
                style={{
                  position: "absolute",
                  top: "50%",
                  right: 10,
                  transform: "translateY(-50%)",
                  zIndex: 3,
                  background: "rgba(255,255,255,0.7)",
                  border: "none",
                  borderRadius: "50%",
                  padding: 8,
                  cursor: "pointer",
                }}
              >
                <IconChevronRight size={18} />
              </button>
            </div>
          )}
        </div>

        {/* Jobb oldal: termék információk */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", width: isMobile ? "100%" : undefined }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <Text size="xl" style={{ fontWeight: 700 }}>{product!.name}</Text>
              {product!.discountPercentage && product!.discountPercentage > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                  <Text
                    size="lg"
                    style={{
                      textDecoration: "line-through",
                      color: "#888",
                      marginBottom: 2,
                      fontWeight: 500,
                    }}
                  >
                    {product!.price.toLocaleString("hu-HU")} Ft
                  </Text>
                  <Text
                    size="xl"
                    style={{
                      color: "red",
                      fontWeight: 700,
                    }}
                  >
                    {Math.round(product!.price * (1 - (product!.discountPercentage ?? 0) / 100)).toLocaleString("hu-HU")} Ft
                  </Text>
                </div>
              ) : (
                <Text size="xl" style={{ fontWeight: 700, color: "green" }}>
                  {product!.price.toLocaleString("hu-HU")} Ft
                </Text>
              )}
            </div>
            <Text size="md" color="green" style={{ fontWeight: 500, marginBottom: "10px" }}>{product?.title}</Text>
            <Text size="md" color="dimmed" style={{ marginBottom: "20px" }}>{product?.description}</Text>
            {product?.size && (
              <>
                <Text fw={500} size="md" style={{ marginBottom: "5px" }}>
                  Méretek:
                </Text>
                <Stack gap="xs" style={{ marginBottom: "20px" }}>
                  {product.size.split(";").map((item, index) => (
                    <Text key={index} size="md" color="dimmed">
                      {item.trim()}
                    </Text>
                  ))}
                </Stack>
              </>
            )}

            <Group gap="xs" align="center" style={{ display: 'flex', marginBottom: "10px", flexDirection: "column", alignItems: 'flex-start' }}>
              {product?.type?.split(",").map((type) => type.trim()).map((type, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '4px', justifyContent: 'flex-start' }}>
                  {typeIcons[type] && (
                    <span style={{ marginRight: "4px", display: 'flex', alignItems: 'center' }}>
                      {typeIcons[type]}
                    </span>
                  )}
                  <Text size="md" color="dimmed" style={{ marginBottom: "0" }}>
                    {type}
                  </Text>
                </div>
              ))}
            </Group>
          </div>
          {/* Gombok alul */}
          <div style={{ display: "flex", flexDirection: "row", marginTop: "auto", gap: "10px" }}>
            {product ?
              <Button color="green" size="md" style={{ width: "45%" }} onClick={() => addToCart(product)}>Kosárba</Button> : null}
            <Button variant="outline" color="green" size="md" style={{ width: "45%" }} onClick={() => setShowReviews(true)}>Vélemények</Button>
          </div>


          {showDetails && (
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <Button variant="subtle" onClick={() => setExpanded(!expanded)}>
                {expanded ? "Kevesebb információ" : "Bővebb információ"}
              </Button>
              <Collapse in={expanded}>
                {(hasLight || hasWater || hasExtra) && (
                  <Table>
                    <thead>
                      <tr>
                        {hasLight && (
                          <td style={{ textAlign: 'center', padding: '5px' }}>
                            <IconSun size={30} style={{ color: '#FFC107', marginBottom: '-5px' }} /> Fény
                          </td>
                        )}
                        {hasWater && (
                          <td style={{ textAlign: 'center', padding: '5px' }}>
                            <IconDroplet size={30} style={{ color: '#2196F3', marginBottom: '-5px' }} /> Víz
                          </td>
                        )}
                        {hasExtra && (
                          <td style={{ textAlign: 'center', padding: '5px' }}>
                            <IconTag size={30} style={{ color: '#4CAF50', marginBottom: '-5px' }} /> Extra
                          </td>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        {hasLight && (
                          <td style={{ textAlign: 'center', padding: '10px' }}>{product.light}</td>
                        )}
                        {hasWater && (
                          <td style={{ textAlign: 'center', padding: '10px' }}>{product.water}</td>
                        )}
                        {hasExtra && (
                          <td style={{ textAlign: 'center', padding: '10px' }}>{product.extra}</td>
                        )}
                      </tr>
                    </tbody>
                  </Table>
                )}

                {hasFact && (
                  <>
                    <div style={{ marginTop: '10px', marginBottom: '10px', borderBottom: '1px solid #dee2e6' }} />
                    <Text size="md" style={{ fontWeight: 'bold', marginTop: '10px' }}>Érdekességek:</Text>
                    <Text size="md" style={{ marginTop: '5px' }}>{product.fact}</Text>
                  </>
                )}
              </Collapse>
            </div>
          )}
        </div>
      </div>


    </Modal>
  );
}
