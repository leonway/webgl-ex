const a = x => {
  const result = x + 1
  console.log('a:',result);
  return result
}

const b = x => {
  const result = x + 2
  console.log('b:',result);
  return result
}

const c = x => {
  const result = x + 3
  console.log('c:',result);
  return result
}

const compose = (...fns) => {
  return (args) => {
    return fns.reduce((fx,fn) => {
      return fn(fx)
    },args)
  }
}

const fn = compose(a,b,c)
console.log('fn',fn);
fn(1)
