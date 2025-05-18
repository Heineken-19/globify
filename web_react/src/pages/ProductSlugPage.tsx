import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { API_URL } from "../config/config";
import { Product } from "../types";
import { formatPrice } from "../utils/formatPrice";
import {
    Loader,
    Text,
    Image,
    Button,
    Title,
    Group,
    Stack,
    Collapse,
    Table,
    Paper,
} from "@mantine/core";
import {
    IconChevronLeft,
    IconChevronRight,
    IconSun,
    IconDroplet,
    IconTag,
    IconPlant,
    IconLeaf,
    IconWind,
    IconPaw,
} from "@tabler/icons-react";
import { Modal } from "@mantine/core";
import { useMediaQuery } from '@mantine/hooks';
import { useState, JSX } from "react";
import api from "../services/api";
import ReviewModal from '../modal/ReviewModal';
import { useCart } from "../context/CartContext";

const fetchProductBySlug = async (slug: string): Promise<Product> => {
    const res = await api.get(`/api/products/slug/${slug}`);
    return res.data;
};

export default function ProductSlugPage() {
    const { slug } = useParams<{ slug: string }>();
    const [imageIndex, setImageIndex] = useState(0);
    const [expanded, setExpanded] = useState(false);
    const { addToCart } = useCart();

    const { data: product, isLoading, error } = useQuery({
        queryKey: ["product-by-slug", slug],
        queryFn: () => fetchProductBySlug(slug!),
        enabled: !!slug,
    });
    const isMobile = useMediaQuery('(max-width: 768px)') ?? false;
    const [showReviews, setShowReviews] = useState(false);
    const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);

    if (isLoading) return <Text style={{ textAlign: "center" }}>Betöltés...</Text>
    if (error || !product)
        return (
            <Text color="red" style={{ textAlign: "center" }}>Hiba történt a termék betöltésekor.</Text>
        );

    const imageUrls =
        product.imageUrls && product.imageUrls.length > 0
            ? product.imageUrls.map((img) => `${API_URL}/uploads/products/${img}`)
            : [`${API_URL}/uploads/products/default.jpg`];

    const typeIcons: Record<string, JSX.Element> = {
        "Állónövény": <IconPlant size={25} />,
        "Futó növény": <IconLeaf size={25} />,
        "Levegő tisztító": <IconWind size={25} />,
        "Állatbarát": <IconPaw size={25} />,
    };

    const hasLight = !!product.light;
    const hasWater = !!product.water;
    const hasExtra = !!product.extra;
    const hasFact = !!product.fact;
    const showDetails = hasLight || hasWater || hasExtra || hasFact;

    const nextImage = () => setImageIndex((imageIndex + 1) % imageUrls.length);
    const prevImage = () => setImageIndex((imageIndex - 1 + imageUrls.length) % imageUrls.length);

    return (
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "2rem" }}>
            <div style={{ marginBottom: "1rem", fontSize: "14px" }}>
                <Link
                    to="/products"
                    style={{ color: "#1a7f37", textDecoration: "underline", fontWeight: 500 }}
                >
                    Termékek
                </Link>
                {typeof product.category === "object" && product.category.name && (
                    <>
                        {" "}-{" "}
                        <Link
                            to={`/products?category=${encodeURIComponent(product.category.name)}`}
                            style={{ color: "#1a7f37", textDecoration: "underline", fontWeight: 500 }}
                        >
                            {product.category.name}
                        </Link>
                    </>
                )}
            </div>

            <Paper shadow="sm" p="lg" radius="md">
                <Group justify="space-between" align="center" mb="md">
                    <Title order={2} style={{ color: "#2f5e38", fontWeight: 600, fontSize: 25 }}>
                        {product.name}
                    </Title>

                    <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 8 }}>
                        <Text fw={700} size="25px" color="green">
                            {product.discountPercentage && product.discountPercentage > 0
                                ? formatPrice(Math.round(product.price * (1 - product.discountPercentage / 100)))
                                : formatPrice(product.price)}
                        </Text>

                        {product.discountPercentage && product.discountPercentage > 0 && (
                            <Text
                                fw={600}
                                size="md"
                                color="dimmed"
                                style={{ textDecoration: "line-through" }}
                            >
                                {formatPrice(product.price)}
                            </Text>
                        )}
                    </div>
                </Group>

                <div style={{ position: "relative", textAlign: "center" }}>
                    <Image
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedImageUrl(imageUrls[imageIndex]);
                        }}

                        src={imageUrls[imageIndex]}
                        height={400}
                        fit="contain"
                        alt={product.name}
                        style={{ borderRadius: 8, cursor: "pointer" }}
                    />
                    {imageUrls.length > 1 && (
                        <>
                            <IconChevronLeft
                                size={32}
                                onClick={prevImage}
                                style={{
                                    position: "absolute",
                                    top: "50%",
                                    left: 10,
                                    transform: "translateY(-50%)",
                                    cursor: "pointer",
                                    backgroundColor: "#fff",
                                    borderRadius: "50%",
                                    padding: 4,
                                }}
                            />
                            <IconChevronRight
                                size={32}
                                onClick={nextImage}
                                style={{
                                    position: "absolute",
                                    top: "50%",
                                    right: 10,
                                    transform: "translateY(-50%)",
                                    cursor: "pointer",
                                    backgroundColor: "#fff",
                                    borderRadius: "50%",
                                    padding: 4,
                                }}
                            />
                        </>
                    )}
                </div>

                <Text size="md" color="green" style={{ fontWeight: 500, marginBottom: "10px" }}>{product?.title}</Text>
                <Text size="md" color="dimmed" style={{ marginBottom: "20px" }}>{product?.description}</Text>

                {product.size && (
                    <Stack gap="xs" mt="md">
                        {product.size.split(";").map((item, index) => (
                            <Text key={index} size="md" color="dimmed">
                                {item.trim()}
                            </Text>
                        ))}
                    </Stack>
                )}

                <Group mt="md" gap="xs" align="center" style={{ display: 'flex', marginBottom: "10px", flexDirection: "column", alignItems: 'flex-start' }}>
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

                <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", marginTop: "auto", gap: "10px" }}>
                    {product ?
                        <Button mt="md" color="green" size="md" style={{ width: "40%" }} onClick={() => addToCart(product)}>Kosárba</Button> : null}
                    <Button mt="md" variant="outline" color="green" size="md" style={{ width: "40%" }} onClick={() => setShowReviews(true)}>Vélemények</Button>
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

                {showReviews && (
                    <ReviewModal
                        productId={product.id}
                        productName={product.name}
                        onClose={() => setShowReviews(false)}
                    />

                )}

                <Modal
                    opened={!!selectedImageUrl}
                    onClose={() => setSelectedImageUrl(null)}
                    size="auto"
                    centered={false}
                    withCloseButton
                    styles={{
                        content: {
                            marginTop: isMobile ? "20vh" : "10vh", // 20% / 30% magasság a felső szélhez képest
                        },
                    }}
                >
                    <img
                        src={selectedImageUrl ?? ""}
                        alt="Termék kép"
                        style={{
                            width: isMobile ? "100%" : "auto",
                            maxWidth: isMobile ? "100%" : "600px", // desktopon legfeljebb 600px széles
                            height: "auto",
                            display: "block",
                            margin: "0 auto",
                        }}
                    />
                </Modal>
            </Paper>
        </div>


    );
}
