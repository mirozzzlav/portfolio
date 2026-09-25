export function HoneypotField({ name = "company" }) {
  return <input type="text" name={name} tabIndex="-1" autoComplete="off" hidden />;
}
