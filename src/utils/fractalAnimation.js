import * as THREE from 'three'

export function initFractalAnimation(canvas) {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true })
  
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  
  const geometry = new THREE.BufferGeometry()
  const particles = 10000
  const positions = new Float32Array(particles * 3)
  const colors = new Float32Array(particles * 3)
  
  for (let i = 0; i < particles * 3; i += 3) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.random() * Math.PI
    const r = 100 + Math.random() * 100
    
    positions[i] = r * Math.sin(phi) * Math.cos(theta)
    positions[i + 1] = r * Math.sin(phi) * Math.sin(theta)
    positions[i + 2] = r * Math.cos(phi)
    
    colors[i] = 0.7 + Math.random() * 0.3
    colors[i + 1] = 0.5 + Math.random() * 0.3
    colors[i + 2] = 0.9 + Math.random() * 0.1
  }
  
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  
  const material = new THREE.PointsMaterial({
    size: 2,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    transparent: true,
    opacity: 0.8
  })
  
  const particleSystem = new THREE.Points(geometry, material)
  scene.add(particleSystem)
  
  camera.position.z = 300
  
  let time = 0
  
  function animate() {
    requestAnimationFrame(animate)
    
    time += 0.001
    particleSystem.rotation.x = time * 0.5
    particleSystem.rotation.y = time * 0.3
    
    const positions = geometry.attributes.position.array
    for (let i = 0; i < positions.length; i += 3) {
      positions[i + 1] += Math.sin(time + i) * 0.1
    }
    geometry.attributes.position.needsUpdate = true
    
    renderer.render(scene, camera)
  }
  
  animate()
  
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  })
  
  return renderer
}