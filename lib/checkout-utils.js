/**
 *
 * @param {object[]} items an array of objects containing the price infomation of product items
 * @returns {number} the sum of the prices of the products
 */
export const getCheckoutPrice = items => {
  let checkoutPrice = 0
  items.forEach(item => {
    checkoutPrice += item.cart.amount
  })

  return checkoutPrice
}

/**
 *
 * @param {object[]} items An array of mongoDB objects with and _id feild
 * @returns {object[]}
 */
export const getCartItems = items => {
  const cartItems = items.map(item => {
    let preSaleSizeObject
    const purchasedSize = item.cart.size

    if (purchasedSize) {
      preSaleSizeObject = item.sizes.find(
        size => size.size === purchasedSize
      )
    }

    return {
      productId: item._id,
      productName: item.name,
      brand: item.brand,
      paidAmount: item.cart.amount,
      salesQuantity: item.cart.quantity,
      itemSize: purchasedSize,
      coverImage: item.imageCover,
      itemPrice: item.discountPrice || item.price,
      newQuantityForSize: preSaleSizeObject?.quantity - item.cart.quantity,
    }
  })

  return cartItems
}
