const defAttr = () => ({
  gl: null,
  vertices: [],
  geoData: [],
  size: 3,
  attrName: 'a_Position',
  uniforms:{},
  count: 0,
  types: ['POINTS'],
  circleDot: false, // 是不是圆点
  u_IsPOINTS: null, // uniform变量
})

export default class Poly {
  constructor(attr) {
    // console.log('ctor', this, defAttr(), attr)
    Object.assign(this, defAttr(), attr)
    // console.log('ctor', JSON.stringsify(this), defAttr(), attr)
    this.init()
  }
  init() {
    const { attrName,size, gl, circleDot } = this
    if (!gl) return
    // 缓冲对象
    const vertexBuffer = gl.createBuffer()
    // 往webgl 绑定缓冲对象
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    //写入数据
    this.updateBuffer()
    // 获取attribute 变量
    const a_Position = gl.getAttribLocation(gl.program, attrName)
    // 修改attribute 变量
    gl.vertexAttribPointer(a_Position, size, gl.FLOAT, false, 0, 0)
    // 赋能-批处理
    gl.enableVertexAttribArray(a_Position)
    // 如果是圆点就获取一下uniform变脸
    if (circleDot) {
      this.u_IsPOINTS = gl.getUniformLocation(gl.program, 'u_IsPOINTS')
    }
    this.updateUniform()
  }
  updateUniform(){
    const {gl,uniforms} = this
    for (let [key,val] of Object.entries(uniforms)) {
      const { type,value } = val
      const u = gl.getUniformLocation(gl.program,key)
      if(type.includes('Matrix')){
        gl[type](u,false,value)
      }else{
        gl[type](u,value)
      }
    }
  }
  updateBuffer() {
    const { gl, vertices } = this
    this.updateCount()
    // console.log('this.count', this.count)
    // 写入数据
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)
  }
  updateCount() {
    this.count = this.vertices.length / this.size
  }
  addVertice(...data) {
    this.vertices.push(...data)
    this.updateBuffer()
  }
  popVertice() {
    const { vertices, size } = this
    const len = vertices.length
    vertices.splice(len - size, len)
    this.updateCount()
  }
  setVertice(ind, ...data) {
    const { vertices, size } = this
    const i = ind * size
    data.forEach((param, index) => {
      vertices[i + index] = param
    })
  }
  updateVertices(params) {
    const { geoData } = this
    const vertices = []
    geoData.forEach((data) => {
      params.forEach((key) => {
        vertices.push(data[key])
      })
    })
    this.vertices = vertices
  }
  draw(types = this.types) {
    const { gl, count, u_IsPOINTS, circleDot } = this
    // console.log('this', JSON.stringify(this))
    for (let type of types) {
      // console.log('type', type, count)
      circleDot && gl.uniform1f(u_IsPOINTS, type === 'POINTS')
      gl.drawArrays(gl[type], 0, count)
    }
  }
}
