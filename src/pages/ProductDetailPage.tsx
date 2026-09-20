import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowUpRight, ArrowLeft } from 'lucide-react';
import { getProductBySlug, RELEASED_PRODUCTS } from '../data/products';
import { ProductMediaStage } from '../components/product/ProductMediaStage';
import { ProductPurchasingPanel } from '../components/product/ProductPurchasingPanel';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const product = slug ? getProductBySlug(slug) : RELEASED_PRODUCTS[0];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!product) {
    return (
      <div className="min-h-screen bg-black text-bone flex flex-col items-center justify-center p-6 space-y-6">
        <h1
          className="text-5xl sm:text-7xl text-bone uppercase leading-[0.95]"
          style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic" }}
        >
          Specimen not found
        </h1>
        <p
          className="text-lg text-bone/50 max-w-sm text-center"
          style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic" }}
        >
          The requested garment record does not exist in the archive.
        </p>
        <button onClick={() => navigate('/shop')} className="btn-mono">
          Return to shop
        </button>
      </div>
    );
  }

  const alternateProduct = RELEASED_PRODUCTS.find((p) => p.id !== product.id);

  return (
    <div className="min-h-screen bg-black text-bone pt-24 sm:pt-32 pb-24">
      <div className="max-w-[1760px] mx-auto px-5 sm:px-8 md:px-12">
        {/* Breadcrumb */}
        <div className="flex items-center justify-between border-b border-hairline pb-4 mb-8 sm:mb-12">
          <Link to="/shop" className="link-arrow text-bone/60 hover:text-gold">
            <ArrowLeft size={14} />
            Return to catalog
          </Link>
          <div className="flex items-center gap-3 font-mono text-[10px] tracking-[0.28em] uppercase">
            <span className="text-bone/40">Release 001</span>
            <span className="text-gold">·</span>
            <span className="text-bone">{product.code}</span>
          </div>
        </div>

        {/* Main layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          <div className="lg:col-span-7 space-y-8">
            <ProductMediaStage productId={product.id} productName={product.name} />

            {/* Archival spec note */}
            <div className="border-l-2 border-gold pl-6 py-2 space-y-2 max-w-2xl">
              <div className="folio text-gold">Archival specification note</div>
              <p
                className="text-xl sm:text-2xl text-bone/85 leading-snug"
                style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic" }}
              >
                “Engineered to maintain strict structural lines regardless of physical cadence. The heavy 480GSM weight creates a distinct drape that resists fabric breakdown over time.”
              </p>
            </div>
          </div>

          <div className="lg:col-span-5">
            <ProductPurchasingPanel product={product} />
          </div>
        </div>

        {/* Complementary piece */}
        {alternateProduct && (
          <div className="mt-24 sm:mt-32 pt-16 border-t border-hairline">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div className="space-y-2">
                <div className="folio text-gold">Complementary specimen</div>
                <h3
                  className="text-4xl sm:text-6xl text-bone uppercase leading-[0.92] tracking-[-0.005em]"
                  style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic", letterSpacing: "0.005em" }}
                >
                  Explore{' '}
                  <span
                    className="italic text-hollow-gold"
                    style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic", fontWeight: 400 }}
                  >
                    {alternateProduct.name}
                  </span>
                </h3>
              </div>
              <Link to={`/shop/${alternateProduct.slug}`} className="link-arrow text-bone/70 hover:text-gold">
                View dossier <ArrowUpRight size={14} className="arrow-icon" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 sm:gap-8 items-stretch border border-hairline hover:border-gold transition-colors">
              <div className="sm:col-span-5 aspect-[4/3] overflow-hidden bg-ink">
                <img
                  src={alternateProduct.heroImage}
                  alt={alternateProduct.name}
                  className="w-full h-full object-cover img-mono"
                />
              </div>
              <div className="sm:col-span-7 p-8 lg:p-12 flex flex-col justify-center space-y-4">
                <div className="folio text-gold">{alternateProduct.code}</div>
                <h4
                  className="text-4xl sm:text-5xl text-bone leading-none uppercase"
                  style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic" }}
                >
                  {alternateProduct.name}
                </h4>
                <p
                  className="text-base text-bone/60 leading-relaxed max-w-md"
                  style={{ fontFamily: "'PP Editorial New', serif", fontStyle: "italic" }}
                >
                  {alternateProduct.shortDescription}
                </p>
                <Link
                  to={`/shop/${alternateProduct.slug}`}
                  className="btn-mono mt-2 w-fit"
                >
                  Switch to {alternateProduct.name}
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
