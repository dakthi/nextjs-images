.products |= map(
  if .id == "product-297" then
    .images = {
      "topLeft": "/product-297-topLeft.webp",
      "topRight": "/product-297-topRight.webp",
      "bottomLeft": "/product-297-bottomLeft.webp"
    }
  elif .id == "product-297-1" then
    .images = {
      "topLeft": "/product-297-1-topLeft.webp",
      "topRight": "/product-297-1-topRight.webp",
      "bottomLeft": "/product-297-1-bottomLeft.webp"
    }
  elif .id == "product-297-2" then
    .images = {
      "topLeft": "/product-297-2-topLeft.webp",
      "topRight": "/product-297-2-topRight.webp",
      "bottomLeft": "/product-297-2-bottomLeft.webp"
    }
  else
    .
  end
)
