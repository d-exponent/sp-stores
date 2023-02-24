import { useState, useRef, Fragment } from 'react'
import axios from 'axios'

import Input from '../../ui/input'
import FirstForm from '../forms/create-product/first-form'
import SecondForm from '../forms/create-product/second-form'
import ThirdForm from '../forms/create-product/third-form'
import classes from './upload.module.css'

export default function UploadProductForm() {
  const SUBMIT_BTN_VALUE = 'upload product'

  const [numOfProductImagesInputsEl, setNumOfProductImagesInputsEl] =
    useState(0)
  const [productUploadFormBtnValue, setProductUploadFormBtnValue] =
    useState(SUBMIT_BTN_VALUE)
  const [productSizes, setProductSizes] = useState([])

  const productImagesNumElRef = useRef(null)
  const productSizesRef = useRef(null)

  const handleSubmit = function (event) {
    event.preventDefault()

    const form = event.target
    const url = event.target.action
    const formData = new FormData(form)
    formData.set('sizes', productSizes)

    setProductUploadFormBtnValue('uploading...')
    axios
      .post(url, formData)
      .then(response => {
        setProductUploadFormBtnValue('Product uploaded successfull')
        const timer = setTimeout(() => {
          setProductUploadFormBtnValue(SUBMIT_BTN_VALUE)
          clearTimeout(timer)
          form.reset()
        }, 3000)
      })
      .catch(error => {
        setProductUploadFormBtnValue('Error uploading product')
        const timer = setTimeout(() => {
          setProductUploadFormBtnValue(SUBMIT_BTN_VALUE)

          clearTimeout(timer)
        }, 3000)
      })
  }

  const handleProductImages = function (event) {
    event.preventDefault()
    const numOfProductImages = +productImagesNumElRef.current.value
    setNumOfProductImagesInputsEl(numOfProductImages)
  }

  let productImagesInputEl
  if (numOfProductImagesInputsEl) {
    const dummyArr = new Array(numOfProductImagesInputsEl).fill(1)

    productImagesInputEl = dummyArr.map((element, i) => {
      return <Input key={i} name="images" type="file" accept="image/*" />
    })
  }

  const handleSizesSubmit = function (event) {
    event.preventDefault()
    const { value } = productSizesRef.current

    if (value !== '') setProductSizes(prevState => [...prevState, value])
  }

  let sizesEl
  if (productSizes.length > 0) {
    const unique = [...new Set(productSizes)]
    sizesEl = unique.map((size, i) => (
      <div key={i} className={classes.size}>
        {size}
      </div>
    ))
  }

  return (
    <section className={classes.container}>
      <h2>Register New Product</h2>
      <Fragment>
        <FirstForm
          onSubmit={handleSubmit}
          imagesNum={numOfProductImagesInputsEl}
          imagesEl={productImagesInputEl}
          btnValue={productUploadFormBtnValue}
          btnClass={'allow-positioning'}
        />
        <SecondForm
          onSubmit={handleProductImages}
          reference={productImagesNumElRef}
        />
        <ThirdForm
          onSubmit={handleSizesSubmit}
          reference={productSizesRef}
          sizes={sizesEl}
          sizeArray={productSizes}
        />
      </Fragment>
    </section>
  )
}
