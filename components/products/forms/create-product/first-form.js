import { Fragment } from 'react'

import Input from '../../../ui/input'
import Button from '../../../ui/button'
import classes from './first-form.module.css'

export default function FirstForm(props) {
  return (
    <form
      action="/api/products"
      className={classes.form}
      onSubmit={props.onSubmit}
    >
      <Fragment>
        <Input label="Name" name="name" type="text" required={true} />
        <Input label="Brand" name="brand" type="text" required={true} />
        <Input label="Color" name="color" type="text" required={true} />
        <Input
          label="Product Type"
          name="productType"
          type="text"
          required={true}
        />
        <Input label="Price" name="price" type="text" required={true} />
        <Input label="Quantity" name="quantity" type="text" />
        <Input label="Discount price" name="discountPrice" type="text" />
      </Fragment>

      <select className={classes.select} id="category" name="category">
        <option value="">Collection</option>
        <option value="clothing">Clothing</option>
        <option value="footwares">Footware</option>
        <option value="accessories">Accessory</option>
      </select>

      <div>
        <Input
          label="Product Description 👇 "
          name="description"
          type="textarea"
        />
      </div>

      <div className={classes.coverImageInputWrapper}>
        <label htmlFor="imageCover" className={classes.coverImageLabel}>
          👈 Cover image
        </label>
        <Input name="imageCover" type="file" accept="image/*" />
      </div>

      <div className={classes.imageInputWrapper}>
        {props.imagesNum > 0 && props.imagesEl}
      </div>

      <Button
        classes={classes.btn}
        value={props.btnValue}
        btnClass={props.btnClass}
      />
    </form>
  )
}
