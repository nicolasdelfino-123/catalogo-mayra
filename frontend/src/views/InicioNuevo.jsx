import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Context } from "../js/store/appContext.jsx";
import ProductCardPerfumes from "../components/ui/cards/ProductCardPerfumes.jsx";
import { storeConfig } from "../config/storeConfig";
import { getNormalizedCategoryId, mapCategoryIdFromName } from "../utils/perfumeCategories.js";
import { getApiUrl } from "../utils/apiUrl.js";

import afnan from '../assets/afnan.webp'
import al from '../assets/al.webp'
import alhara from '../assets/alhara.png'
import armaf from '../assets/armaf.webp'
import bharara from '../assets/bharara.webp'
import french from '../assets/french.webp'

import lattafa from '../assets/lattafa.png'
import maison from '../assets/maison.jpg'
import rasasi from '../assets/rasasi.png'
import ray from '../assets/raysi.jpg'

const API = getApiUrl();

const cssValue = (value, fallback) =>
    value === undefined || value === null || value === "" ? fallback : value;

const buildHeroFrameStyle = (settings = {}, defaults = {}) => ({
    minHeight: cssValue(settings.sectionMinHeight, defaults.sectionMinHeight),
    paddingTop: cssValue(settings.sectionPaddingTop, defaults.sectionPaddingTop),
    paddingBottom: cssValue(settings.sectionPaddingBottom, defaults.sectionPaddingBottom),
    marginTop: cssValue(settings.sectionMarginTop, defaults.sectionMarginTop),
    marginBottom: cssValue(settings.sectionMarginBottom, defaults.sectionMarginBottom),
});

const buildHeroImageStyle = (settings = {}, defaults = {}) => ({
    width: cssValue(settings.imageWidth, defaults.imageWidth),
    maxWidth: cssValue(settings.imageMaxWidth, defaults.imageMaxWidth),
    height: cssValue(settings.imageHeight, defaults.imageHeight),
    minHeight: cssValue(settings.imageMinHeight, defaults.imageMinHeight),
    maxHeight: cssValue(settings.imageMaxHeight, defaults.imageMaxHeight),
    objectFit: cssValue(settings.imageFit, defaults.imageFit),
    objectPosition: cssValue(settings.imagePosition, defaults.imagePosition),
    transform: `translate(${cssValue(settings.imageOffsetX, defaults.imageOffsetX)}, ${cssValue(settings.imageOffsetY, defaults.imageOffsetY)})`,
});

const buildHeroTextBlockStyle = (settings = {}, base = {}) => ({
    height: cssValue(settings.height, "auto"),
    paddingTop: cssValue(settings.paddingTop, "24px"),
    paddingBottom: cssValue(settings.paddingBottom, "24px"),
    paddingLeft: cssValue(settings.paddingX, "20px"),
    paddingRight: cssValue(settings.paddingX, "20px"),
    marginTop: cssValue(settings.marginTop, "0px"),
    marginBottom: cssValue(settings.marginBottom, "0px"),
    background: cssValue(base.background, "#000000"),
});

export default function InicioNuevo() {
    const { store, actions } = useContext(Context);
    const location = useLocation();
    const navigate = useNavigate();
    const [homeFeaturedIds, setHomeFeaturedIds] = useState(null);
    const heroImageDesktop = `/${storeConfig.media.heroImageDesktop || storeConfig.media.heroImage || ""}`;
    const heroImageMobile = `/${storeConfig.media.heroImageMobile || storeConfig.media.heroImageDesktop || storeConfig.media.heroImage || ""}`;
    const heroConfig = storeConfig.hero || {};
    const desktopHero = heroConfig.desktop || {};
    const mobileHero = heroConfig.mobile || {};
    const textBlockConfig = heroConfig.textBlock || {};
    const showHeroTextBlock = textBlockConfig.enabled === true;

    useEffect(() => {
        if (actions?.fetchProducts) {
            actions.fetchProducts();
        }
        fetch(`${API}/public/home-featured-products`)
            .then((res) => (res.ok ? res.json() : { product_ids: [] }))
            .then((data) => {
                setHomeFeaturedIds((data?.product_ids || []).map(Number));
            })
            .catch(() => {
                setHomeFeaturedIds([]);
            });
    }, []);

    const allProducts = store.products || [];
    const womenCategoryId = mapCategoryIdFromName("Femeninos");
    const menCategoryId = mapCategoryIdFromName("Masculinos");
    const getProductPrice = (product) => {
        const price = Number(product?.price);
        return Number.isFinite(price) ? price : Number.POSITIVE_INFINITY;
    };
    const isWomenFragrance = (product) => getNormalizedCategoryId(product) === womenCategoryId;
    const isMenFragrance = (product) => getNormalizedCategoryId(product) === menCategoryId;

    const womenFeatured = allProducts
        .filter(isWomenFragrance)
        .sort((a, b) => getProductPrice(a) - getProductPrice(b))
        .slice(0, 6);
    const menFeatured = allProducts
        .filter(isMenFragrance)
        .sort((a, b) => getProductPrice(a) - getProductPrice(b))
        .slice(0, 6);
    const selectedFeaturedIds = new Set([...womenFeatured, ...menFeatured].map((p) => p.id));
    const fallbackFeaturedProducts = [
        ...womenFeatured,
        ...menFeatured,
        ...allProducts.filter((p) => !selectedFeaturedIds.has(p.id)).slice(0, Math.max(0, 12 - (womenFeatured.length + menFeatured.length))),
    ].slice(0, 12);
    const productById = new Map(allProducts.map((product) => [Number(product.id), product]));
    const selectedHomeProducts = (homeFeaturedIds || [])
        .map((productId) => productById.get(Number(productId)))
        .filter(Boolean);
    const featuredProducts = homeFeaturedIds === null
        ? []
        : homeFeaturedIds.length > 0
            ? selectedHomeProducts
            : fallbackFeaturedProducts;


    useLayoutEffect(() => {
        const lastId = sessionStorage.getItem("lastProductId");
        if (!lastId) return;

        const el = document.querySelector(`[data-product-id="${lastId}"]`);
        if (!el) return;

        el.scrollIntoView({ block: "center" });

        // opcional: limpiar para que no te re-scrollee en futuras entradas
        sessionStorage.removeItem("lastProductId");
    }, []);



    useEffect(() => {
        if (location.state?.scrollTo === "contacto") {
            const el = document.getElementById("asesoria");
            if (!el) return;
            const headerH = document.querySelector("header")?.offsetHeight || 80;
            const y = el.getBoundingClientRect().top + window.pageYOffset - headerH - 8;
            window.scrollTo({ top: y, behavior: "smooth" });
        }
    }, [location.state]);
    return (
        <div className="min-h-screen bg-gray-50">


            {/* HERO PREMIUM CON IMAGEN CONFIGURABLE DESDE storeConfig */}
            <section className="relative overflow-hidden bg-[#0B0608] text-center">
                <div className="lg:hidden" style={buildHeroFrameStyle(mobileHero, {
                    sectionMinHeight: "auto",
                    sectionPaddingTop: "80px",
                    sectionPaddingBottom: "0px",
                    sectionMarginTop: "0px",
                    sectionMarginBottom: "0px",
                })}>
                    <img
                        src={heroImageMobile}
                        alt="banner"
                        className="mx-auto block brightness-110 saturate-110"
                        style={buildHeroImageStyle(mobileHero, {
                            imageWidth: "100%",
                            imageMaxWidth: "100%",
                            imageHeight: "auto",
                            imageMinHeight: "auto",
                            imageMaxHeight: "none",
                            imageFit: "contain",
                            imagePosition: "center center",
                            imageOffsetX: "0px",
                            imageOffsetY: "0px",
                        })}
                    />

                    {showHeroTextBlock && (
                        <div
                            className="flex flex-col items-center justify-center"
                            style={buildHeroTextBlockStyle(textBlockConfig.mobile, textBlockConfig)}
                        >
                            <h1
                                className="mb-3 font-serif text-[22px] font-semibold leading-tight tracking-wide sm:text-[24px]"
                                style={{ color: cssValue(textBlockConfig.textColor, "#ffffff") }}
                            >
                                {storeConfig.branding.heroTitle}
                            </h1>

                            <p
                                className="mx-auto max-w-[420px] font-serif text-[14px] leading-relaxed tracking-wide sm:text-[15px]"
                                style={{ color: cssValue(textBlockConfig.subtitleColor, "#e5e7eb") }}
                            >
                                {storeConfig.branding.heroSubtitle}
                            </p>
                        </div>
                    )}
                </div>

                <div className="hidden lg:block" style={buildHeroFrameStyle(desktopHero, {
                    sectionMinHeight: "auto",
                    sectionPaddingTop: "0px",
                    sectionPaddingBottom: "0px",
                    sectionMarginTop: "0px",
                    sectionMarginBottom: "0px",
                })}>
                    <img
                        src={heroImageDesktop}
                        alt="banner"
                        className="mx-auto block brightness-110 saturate-110"
                        style={buildHeroImageStyle(desktopHero, {
                            imageWidth: "100%",
                            imageMaxWidth: "100%",
                            imageHeight: "auto",
                            imageMinHeight: "auto",
                            imageMaxHeight: "calc(100vh - 80px)",
                            imageFit: "contain",
                            imagePosition: "center center",
                            imageOffsetX: "0px",
                            imageOffsetY: "0px",
                        })}
                    />

                    {showHeroTextBlock && (
                        <div
                            className="flex flex-col items-center justify-center"
                            style={buildHeroTextBlockStyle(textBlockConfig.desktop, textBlockConfig)}
                        >
                            <h1
                                className="mb-4 font-serif text-3xl font-semibold tracking-wide"
                                style={{ color: cssValue(textBlockConfig.textColor, "#ffffff") }}
                            >
                                {storeConfig.branding.heroTitle}
                            </h1>

                            <p
                                className="font-serif text-xl tracking-wide"
                                style={{ color: cssValue(textBlockConfig.subtitleColor, "#e5e7eb") }}
                            >
                                {storeConfig.branding.heroSubtitle}
                            </p>
                        </div>
                    )}
                </div>
            </section>
            {/* 
            <div className="relative z-10 overflow-hidden whitespace-nowrap bg-gradient-to-r from-black via-[#0B0608] to-black py-3">
         
                <div className="marquee-track will-change-transform">
                    
                    <div className="marquee-group">
                        <span className="text-white text-lg md:text-2xl font-semibold mx-[40px]">
                            3 cuotas sin interés<span className="mx-6">•</span>Descuentos Pago Efectivo / Transferencia
                        </span>
                        <span className="text-white text-lg md:text-2xl font-semibold mx-[40px]">
                            3 cuotas sin interés<span className="mx-6">•</span>Descuentos Pago Efectivo / Transferencia
                        </span>
                    </div>
            
                    <div className="marquee-group" aria-hidden="true">
                        <span className="text-white text-lg md:text-2xl font-semibold mx-[40px]">
                            3 cuotas sin interés<span className="mx-6">•</span>Descuentos Pago Efectivo / Transferencia
                        </span>
                        <span className="text-white text-lg md:text-2xl font-semibold mx-[40px]">
                            3 cuotas sin interés<span className="mx-6">•</span>Descuentos Pago Efectivo / Transferencia
                        </span>
                    </div>
                </div>
            </div> */}

            <style>{`
    .marquee-track {
      display: inline-flex;
      animation: marquee 32s linear infinite;
    }
    .marquee-group {
      display: inline-flex;
    }
    /* Se anima solo hasta -50% porque hay 2 grupos idénticos → no hay baches */
    @keyframes marquee {
      from { transform: translateX(0); }
      to   { transform: translateX(-50%); }
    }
  `}</style>

            {/* PRODUCTOS */}
            <section className="max-w-7xl mx-auto px-2 sm:px-4 pt-12 pb-0">
                <div className="text-center mb-10">
                    <h2 className="text-2xl md:text-3xl font-serif font-semibold tracking-wide">
                        Productos Destacados
                    </h2>

                    <div className="w-16 h-[2px] bg-amber-500 mx-auto mt-4"></div>
                </div>

                {store.loading ? (
                    <p className="text-center">Cargando...</p>
                ) : (
                    <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
                        {featuredProducts.map((product) => (
                            <div
                                key={product.id}
                                data-product-id={product.id}
                                className="transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl rounded-xl"
                            >
                                <ProductCardPerfumes product={product} returnTo={location.pathname} isGrid={false} />
                            </div>
                        ))}
                    </div>
                )}
            </section>
            <div className="flex justify-center mt-[2cm] mb-[2cm] px-4 lg:px-12">
                <div
                    onClick={() => navigate(location.pathname.startsWith("/mayorista") ? "/mayorista/products" : "/products")}
                    className="
cursor-pointer
px-8 py-3
font-serif
tracking-wide
text-sm
uppercase
rounded-lg
text-white
bg-[#0B0608] border border-[#C9A227] text-[#C9A227] hover:bg-[#C9A227] hover:text-black
bg-[length:200%_100%]
bg-left
hover:bg-right
transition-all duration-500
shadow-lg shadow-amber-500/20
"
                >
                    Explorar todas las categorías
                </div>
            </div>
            {/* Contactanos y mapa comentados por pedido del cliente. */}
            {storeConfig.features?.showBrandCarousel !== false && (
                <section className="relative bg-white py-8 fade-in-section border-y border-gray-200">
                    <div className="relative z-10 overflow-hidden whitespace-nowrap mx-0 md:mx-[104px]">
                        <div className="brands-track will-change-transform">

                            <div className="brands-group">
                                <div className="brand-container">
                                    <img src={afnan} alt="Afnan" className="brand-img" />
                                </div>
                                <div className="brand-container">
                                    <img src={al} alt="al" className="brand-img" />
                                </div>
                                <div className="brand-container">
                                    <img src={alhara} alt="alhara" className="brand-img" />
                                </div>
                                <div className="brand-container">
                                    <img src={armaf} alt="Armaf" className="brand-img" />
                                </div>
                                <div className="brand-container">
                                    <img src={bharara} alt="Bharara" className="brand-img" />
                                </div>
                                <div className="brand-container">
                                    <img src={french} alt="French" className="brand-img" />
                                </div>
                                <div className="brand-container">
                                    <img src={lattafa} alt="Lattafa" className="brand-img" />
                                </div>
                                <div className="brand-container">
                                    <img src={maison} alt="Maison" className="brand-img" />
                                </div>
                                <div className="brand-container">
                                    <img src={rasasi} alt="Rasasi" className="brand-img" />
                                </div>
                                <div className="brand-container">
                                    <img src={ray} alt="Ray" className="brand-img" />
                                </div>
                            </div>


                            <div className="brands-group" aria-hidden="true">
                                <div className="brand-container">
                                    <img src={afnan} alt="Afnan" className="brand-img" />
                                </div>
                                <div className="brand-container">
                                    <img src={al} alt="al" className="brand-img" />
                                </div>
                                <div className="brand-container">
                                    <img src={alhara} alt="alhara" className="brand-img" />
                                </div>
                                <div className="brand-container">
                                    <img src={armaf} alt="Armaf" className="brand-img" />
                                </div>
                                <div className="brand-container">
                                    <img src={bharara} alt="Bharara" className="brand-img" />
                                </div>
                                <div className="brand-container">
                                    <img src={french} alt="French" className="brand-img" />
                                </div>
                                <div className="brand-container">
                                    <img src={lattafa} alt="Lattafa" className="brand-img" />
                                </div>
                                <div className="brand-container">
                                    <img src={maison} alt="Maison" className="brand-img" />
                                </div>
                                <div className="brand-container">
                                    <img src={rasasi} alt="Rasasi" className="brand-img" />
                                </div>
                                <div className="brand-container">
                                    <img src={ray} alt="Ray" className="brand-img" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <style>{`
        .brands-track {
            display: inline-flex;
            animation: brandsScroll 32s linear infinite;
        }

        .brands-group {
            display: flex;
            align-items: center;
        }

        .brand-container {
            width: 180px;
            height: 4rem;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }

        .brand-img {
            max-height: 4rem;
            max-width: 140px;
            width: auto;
            height: auto;
            object-fit: contain;
            display: block;
            margin: 0;
            padding: 0;
        }

        @keyframes brandsScroll {
            from { transform: translateX(0); }
            to   { transform: translateX(-50%); }
        }

       /*  .brands-track:hover {
	            animation-play-state: paused;
	        } */
	    `}</style>
                </section>
            )}


        </div>
    );
}
