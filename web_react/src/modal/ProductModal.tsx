import { useState, JSX } from "react";
import { Modal, Image, Button, Text, Collapse, Group, Table } from "@mantine/core";
import { IconPlant, IconLeaf, IconWind, IconPaw, IconSun, IconDroplet, IconTag } from '@tabler/icons-react';
import { useProduct } from "../hooks/useProducts";
import { ProductModalProps } from "../types";
import { API_URL } from '../config/config';
import ReviewModal from './ReviewModal';



export default function ProductModal({ productId, opened, onClose, addToCart }: ProductModalProps) {
  const { data: product, isLoading, error } = useProduct(productId);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [expanded, setExpanded] = useState<boolean>(false);
  const [showReviews, setShowReviews] = useState(false);



  if (!productId || isLoading) return null;
  if (error) return <Text color="red">{error.message}</Text>;


  const imageUrls: string[] =
    product?.imageUrls && product.imageUrls.length > 0
      ? product.imageUrls.map((imgPath) => `${API_URL}/uploads/${imgPath}`)
      : [`${API_URL}/uploads/default.jpg`];

  const formattedPrice = product?.price?.toLocaleString("hu-HU") + " Ft";

  const typeIcons: Record<string, JSX.Element> = {
    "Állónövény": <IconPlant size={25} />,
    "Futó növény": <IconLeaf size={25} />,
    "Levegő tisztító": <IconWind size={25} />,
    "Állatbarát": <IconPaw size={25} />,
  };

  return (
    <Modal opened={opened} onClose={onClose} size="80%" withCloseButton
    styles={{
      content: {
        top: '65px', // Távolság az oldal tetejétől
        position: 'relative',
      }
    }}
    >
      <div style={{ display: "flex", gap: "40px", justifyContent: "center", alignItems: "center", padding: "30px" }}>
        {/* Bal oldalon lapozható képek */}
        <div className="image-slider">
          {imageUrls.length > 0 && (
            <div className="slider-container">
              <button className="prev-btn" onClick={() => setCurrentImageIndex((prev) => (prev - 1 + imageUrls.length) % imageUrls.length)}>&lt;</button>
              <Image src={imageUrls[currentImageIndex]} alt={product?.name || "Termékkép"} fit="contain" width={500} height={500} />
              <button className="next-btn" onClick={() => setCurrentImageIndex((prev) => (prev + 1) % imageUrls.length)}>&gt;</button>
            </div>
          )}
        </div>

        {/* Jobb oldal: termék információk */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <Text size="xl" style={{ fontWeight: 700 }}>{product?.name}</Text>
            <Text size="xl" style={{ fontWeight: 700, color: "green" }}>{formattedPrice}</Text>
          </div>
          <Text size="md" color="green" style={{ fontWeight: 500, marginBottom: "10px" }}>{product?.title}</Text>
          <Text size="md" color="dimmed" style={{ marginBottom: "20px" }}>{product?.description}</Text>
          <Text size="md" color="dimmed" style={{ marginBottom: "20px" }}>Termék mérete: {product?.size} cm</Text>

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
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "auto", alignItems: "flex-end" }}>
            {product ? 
            <Button color="green" size="md" style={{ width: "45%" }}  onClick={() => addToCart(product)}>Kosárba helyezés</Button> : null}
            <Button variant="outline" color="green" size="md" style={{ width: "45%" }} onClick={() => setShowReviews(true)}>Vélemények</Button>
          </div>
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <Button variant="subtle" onClick={() => setExpanded(!expanded)}>
              {expanded ? "Kevesebb információ" : "Bővebb információ"}
            </Button>
            <Collapse in={expanded}>
              <Table
              >
                <thead>
                  <tr>
                  <td style={{ textAlign: 'center', padding: '5px',  width: '33%'}}><IconSun size={30} style={{ color: '#FFC107', marginBottom: '-5px' }} />Fény</td>
                  <td style={{ textAlign: 'center', padding: '5px',  width: '33%'}}><IconDroplet size={30} style={{ color: '#2196F3', marginBottom: '-5px' }} />Víz</td>
                  <td style={{ textAlign: 'center', padding: '5px',  width: '33%'}}><IconTag size={30} style={{ color: '#4CAF50', marginBottom: '-5px' }} />Extra</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ textAlign: 'center', padding: '10px' }}>{product?.light || 'N/A'}</td>
                    <td style={{ textAlign: 'center', padding: '10px' }}>{product?.water || 'N/A'}</td>
                    <td style={{ textAlign: 'center', padding: '10px' }}>{product?.extra || 'N/A'}</td>
                  </tr>
                </tbody>
              </Table>

              {/* Vékony szürke vonal */}
              <div style={{
                marginTop: '10px',
                marginBottom: '10px',
                borderBottom: '1px solid #dee2e6'
              }} />

              {/* Érdekességek rész */}
              <Text size="md" style={{ fontWeight: 'bold', marginTop: '10px' }}>
                Érdekességek: 
              </Text>
              <Text size="md" style={{ marginTop: '5px' }}>
                {product?.fact || 'Nincs érdekesség megadva.'}
              </Text>
            </Collapse>
          </div>
        </div>
      </div>

      {/* 🔹 CSS a lapozáshoz */}
      <style>
        {`
    .image-slider {
      position: relative;
      width: 500px;
      height: 500px;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      border-radius: 8px;
    }

    .slider-container {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .prev-btn, .next-btn {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background: transparent;
      color: #2ecc71; /* Zöld szín */
      border: none;
      padding: 10px;
      font-size: 32px;
      cursor: pointer;
      z-index: 10;
      transition: transform 0.2s ease-in-out;
    }

    .prev-btn {
      left: 10px;
    }

    .next-btn {
      right: 10px;
    }

    .prev-btn:hover, .next-btn:hover {
      transform: translateY(-50%) scale(1.2); /* Hover effekt */
    }
  `}
      </style>
      {showReviews && (
        <ReviewModal productId={productId} onClose={() => setShowReviews(false)} />
      )}
    </Modal>
  );
}
