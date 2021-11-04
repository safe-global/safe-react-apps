function resolvePath(path: string, obj: any) {
  const props = path.split('.');
  return props.reduce((prev, curr) => prev && prev[curr], obj);
}

function descendingComparator<T>(a: T, b: T, orderBy: string) {
  let item1 = resolvePath(orderBy, a);
  let item2 = resolvePath(orderBy, b);

  if (isNumeric(item1) && isNumeric(item2)) {
    return item1 - item2;
  }

  if (item2 < item1) {
    return -1;
  }

  if (item2 > item1) {
    return 1;
  }

  return 0;
}

function isNumeric(num: any) {
  return !isNaN(num);
}

export function getComparator<T>(order: string, orderBy: string | undefined): (a: T, b: T) => number {
  if (!orderBy) {
    return () => 0;
  }

  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}
