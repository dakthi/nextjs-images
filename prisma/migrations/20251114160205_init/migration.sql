-- CreateTable
CREATE TABLE "brands" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "logo_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "brands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "brand_id" TEXT NOT NULL,
    "product_code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_versions" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "version_number" INTEGER NOT NULL,
    "version_name" TEXT,
    "is_current" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_content" (
    "id" TEXT NOT NULL,
    "version_id" TEXT NOT NULL,
    "content_type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'en',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_images" (
    "id" TEXT NOT NULL,
    "version_id" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "image_type" TEXT NOT NULL,
    "position" TEXT,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "alt_text" TEXT,
    "label" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_properties" (
    "id" TEXT NOT NULL,
    "version_id" TEXT NOT NULL,
    "property_key" TEXT NOT NULL,
    "property_value" TEXT NOT NULL,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_properties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pricing" (
    "id" TEXT NOT NULL,
    "version_id" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'GBP',
    "condition" TEXT,
    "discount_price" DECIMAL(10,2),
    "discount_label" TEXT,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pricing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sales_templates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "template_config" JSONB NOT NULL,
    "html_template" TEXT,
    "preview_url" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sales_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "template_renders" (
    "id" TEXT NOT NULL,
    "template_id" TEXT NOT NULL,
    "product_ids" TEXT[],
    "render_config" JSONB NOT NULL,
    "output_format" TEXT NOT NULL,
    "output_url" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "template_renders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shared_images" (
    "id" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "image_type" TEXT NOT NULL,
    "tags" TEXT[],
    "used_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "shared_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "image_usage" (
    "id" TEXT NOT NULL,
    "shared_image_id" TEXT NOT NULL,
    "version_id" TEXT NOT NULL,
    "position" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "image_usage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_log" (
    "id" TEXT NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "changes" JSONB,
    "performed_by" TEXT NOT NULL,
    "ip_address" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "brands_name_key" ON "brands"("name");

-- CreateIndex
CREATE UNIQUE INDEX "brands_slug_key" ON "brands"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "products_product_code_key" ON "products"("product_code");

-- CreateIndex
CREATE UNIQUE INDEX "products_slug_key" ON "products"("slug");

-- CreateIndex
CREATE INDEX "products_brand_id_idx" ON "products"("brand_id");

-- CreateIndex
CREATE INDEX "products_product_code_idx" ON "products"("product_code");

-- CreateIndex
CREATE INDEX "products_is_active_idx" ON "products"("is_active");

-- CreateIndex
CREATE INDEX "product_versions_product_id_idx" ON "product_versions"("product_id");

-- CreateIndex
CREATE INDEX "product_versions_is_current_idx" ON "product_versions"("is_current");

-- CreateIndex
CREATE INDEX "product_content_version_id_idx" ON "product_content"("version_id");

-- CreateIndex
CREATE INDEX "product_content_content_type_idx" ON "product_content"("content_type");

-- CreateIndex
CREATE INDEX "product_images_version_id_idx" ON "product_images"("version_id");

-- CreateIndex
CREATE INDEX "product_images_image_type_idx" ON "product_images"("image_type");

-- CreateIndex
CREATE INDEX "product_properties_version_id_idx" ON "product_properties"("version_id");

-- CreateIndex
CREATE INDEX "product_properties_property_key_idx" ON "product_properties"("property_key");

-- CreateIndex
CREATE INDEX "pricing_version_id_idx" ON "pricing"("version_id");

-- CreateIndex
CREATE INDEX "template_renders_template_id_idx" ON "template_renders"("template_id");

-- CreateIndex
CREATE INDEX "template_renders_status_idx" ON "template_renders"("status");

-- CreateIndex
CREATE UNIQUE INDEX "shared_images_image_url_key" ON "shared_images"("image_url");

-- CreateIndex
CREATE INDEX "shared_images_image_type_idx" ON "shared_images"("image_type");

-- CreateIndex
CREATE INDEX "image_usage_shared_image_id_idx" ON "image_usage"("shared_image_id");

-- CreateIndex
CREATE INDEX "image_usage_version_id_idx" ON "image_usage"("version_id");

-- CreateIndex
CREATE INDEX "audit_log_entity_type_idx" ON "audit_log"("entity_type");

-- CreateIndex
CREATE INDEX "audit_log_entity_id_idx" ON "audit_log"("entity_id");

-- CreateIndex
CREATE INDEX "audit_log_created_at_idx" ON "audit_log"("created_at");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "brands"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_versions" ADD CONSTRAINT "product_versions_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_content" ADD CONSTRAINT "product_content_version_id_fkey" FOREIGN KEY ("version_id") REFERENCES "product_versions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_images" ADD CONSTRAINT "product_images_version_id_fkey" FOREIGN KEY ("version_id") REFERENCES "product_versions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_properties" ADD CONSTRAINT "product_properties_version_id_fkey" FOREIGN KEY ("version_id") REFERENCES "product_versions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pricing" ADD CONSTRAINT "pricing_version_id_fkey" FOREIGN KEY ("version_id") REFERENCES "product_versions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "template_renders" ADD CONSTRAINT "template_renders_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "sales_templates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "image_usage" ADD CONSTRAINT "image_usage_shared_image_id_fkey" FOREIGN KEY ("shared_image_id") REFERENCES "shared_images"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "image_usage" ADD CONSTRAINT "image_usage_version_id_fkey" FOREIGN KEY ("version_id") REFERENCES "product_versions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
