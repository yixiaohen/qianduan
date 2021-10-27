export function IfSame(obj1, obj2) {
  var obj1keys = Object.keys(obj1);
  var obj2keys = Object.keys(obj2);

  if (obj2keys.length !== obj1keys.length) return false;

  for (let i = 0; i <= obj1keys.length - 1; i++) {
    const key = obj1keys[i];
    if (!obj2keys.includes(key)) return false;
    if (obj2[key] !== obj1[key]) return false;
  }
  return true;
}

