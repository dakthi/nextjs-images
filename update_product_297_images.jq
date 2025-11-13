.products |= map(
  if .id == "product-297" then
    .images = {
      "topLeft": "/product-297-topLeft.jpg",
      "topRight": "/product-297-topRight.jpg",
      "bottomLeft": "/product-297-bottomLeft.jpg"
    }
  elif .id == "product-297-1" then
    .images = {
      "topLeft": "/product-297-1-topLeft.jpg",
      "topRight": "/product-297-1-topRight.jpg",
      "bottomLeft": "/product-297-1-bottomLeft.jpg"
    }
  elif .id == "product-297-2" then
    .images = {
      "topLeft": "/product-297-2-topLeft.jpg",
      "topRight": "/product-297-2-topRight.jpg",
      "bottomLeft": "/product-297-2-bottomLeft.jpg"
    }
  else
    .
  end
)
