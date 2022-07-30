export function getTime() {
  return `${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()}/${new Date().getHours()}:${new Date().getMinutes()}`;
}

export const calcTimeUntilNextPoint = (current: number, count: number) => {
  const begin = new Date(current);
  return new Date(
    begin.getFullYear(),
    begin.getMonth() + count,
    begin.getDate(),
    begin.getHours(),
    begin.getSeconds(),
  ).getTime();
};
