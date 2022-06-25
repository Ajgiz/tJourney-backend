export function getTime() {
  return `${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()}/${new Date().getHours()}:${new Date().getMinutes()}`;
}
