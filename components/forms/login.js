export default function Login(props) {
  return (
    <form onSubmit={props.handleSubmit}>
      <input
        type="email"
        placeholder="youremail@email.com"
        onChange={props.handleChange}
        name="email"
        value={props.formData.email}
        required
      />
      <input
        type="password"
        placeholder="Enter Password"
        onChange={props.handleChange}
        name="password"
        value={props.formData.password}
        required
      />
      <button disabled={props.disableBtn}>login</button>
    </form>
  )
}
