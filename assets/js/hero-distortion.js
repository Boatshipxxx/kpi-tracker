(function () {
  if (typeof THREE === 'undefined') return;
  if (window.matchMedia('(hover: none)').matches) return;

  const heroImg = document.querySelector('.hero-bg-img');
  if (!heroImg) return;

  const heroSection = document.querySelector('.hero');

  const wrapper = document.createElement('div');
  wrapper.style.cssText = [
    'position:absolute',
    'width:clamp(300px,50vw,600px)',
    'height:clamp(300px,50vw,600px)',
    'top:50%',
    'left:50%',
    'transform:translate(-50%,-50%) rotate(10deg)',
    'z-index:1',
    'clip-path:polygon(5% 10%,95% 5%,90% 95%,10% 90%)',
    'filter:grayscale(100%) contrast(3000%) sepia(100%) hue-rotate(-50deg) saturate(500%) drop-shadow(20px 20px 0 #111111)',
    'mix-blend-mode:multiply',
    'opacity:0.9',
    'overflow:hidden',
    'cursor:crosshair'
  ].join(';');

  heroImg.style.cssText += ';opacity:0;pointer-events:none;position:absolute';
  heroSection.appendChild(wrapper);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.domElement.style.cssText = 'width:100%;height:100%;display:block;';
  wrapper.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
  camera.position.z = 1;

  const vShader = `
    uniform float uTime;
    uniform vec2  uMouse;
    uniform float uStrength;
    varying vec2  vUv;
    void main(){
      vUv = uv;
      vec3 pos = position;
      float d    = distance(uv, uMouse);
      float infl = smoothstep(0.55, 0.0, d) * uStrength;
      float angle= atan(uv.y - uMouse.y, uv.x - uMouse.x);
      float twist= sin(d * 10.0 - uTime * 4.0) * infl * 0.12;
      pos.x += cos(angle + twist * 3.14159) * infl * 0.08;
      pos.y += sin(angle + twist * 3.14159) * infl * 0.08;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `;

  const fShader = `
    uniform sampler2D uTex;
    uniform vec2  uMouse;
    uniform float uStrength;
    varying vec2  vUv;
    void main(){
      float d    = distance(vUv, uMouse);
      float infl = smoothstep(0.55, 0.0, d) * uStrength;
      vec2  uv   = vUv + (vUv - uMouse) * infl * -0.06;
      gl_FragColor = texture2D(uTex, uv);
    }
  `;

  const texture = new THREE.TextureLoader().load(heroImg.src);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

  const geo = new THREE.PlaneGeometry(2, 2, 48, 48);
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uTex:      { value: texture },
      uMouse:    { value: new THREE.Vector2(0.5, 0.5) },
      uStrength: { value: 0 },
      uTime:     { value: 0 }
    },
    vertexShader:   vShader,
    fragmentShader: fShader,
    transparent:    true
  });

  scene.add(new THREE.Mesh(geo, mat));

  let tMx = 0.5, tMy = 0.5, cMx = 0.5, cMy = 0.5;
  let tStr = 0,  cStr = 0;

  heroSection.addEventListener('mousemove', e => {
    const r = wrapper.getBoundingClientRect();
    tMx  = (e.clientX - r.left) / r.width;
    tMy  = 1 - (e.clientY - r.top) / r.height;
    tStr = 1;
  });

  heroSection.addEventListener('mouseleave', () => {
    tStr = 0; tMx = 0.5; tMy = 0.5;
  });

  function resize() {
    const w = wrapper.offsetWidth, h = wrapper.offsetHeight;
    if (w && h) {
      renderer.setSize(w, h, false);
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    }
  }
  new ResizeObserver(resize).observe(wrapper);
  resize();

  const clock = new THREE.Clock();
  (function tick() {
    requestAnimationFrame(tick);
    mat.uniforms.uTime.value = clock.getElapsedTime();
    cMx  += (tMx  - cMx)  * 0.07;
    cMy  += (tMy  - cMy)  * 0.07;
    cStr += (tStr - cStr) * 0.05;
    mat.uniforms.uMouse.value.set(cMx, cMy);
    mat.uniforms.uStrength.value = cStr;
    renderer.render(scene, camera);
  })();
})();
