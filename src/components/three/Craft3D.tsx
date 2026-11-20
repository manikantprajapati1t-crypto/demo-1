import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { Mandala } from "../ui/Ornaments";

export type CraftVariant = "pot" | "lamp";

interface Props {
  variant: CraftVariant;
  /** Drag to rotate */
  interactive?: boolean;
  /** Tilt toward the mouse pointer anywhere on the page */
  followPointer?: boolean;
  className?: string;
  label: string;
}

/** Hand-painted terracotta texture generated on a canvas (no network). */
function makePotTexture() {
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 1024;
  const g = c.getContext("2d")!;
  g.fillStyle = "#BC6847";
  g.fillRect(0, 0, 1024, 1024);
  // clay speckle
  for (let i = 0; i < 5200; i++) {
    g.fillStyle = `rgba(${Math.random() > 0.5 ? "90,40,25" : "235,190,150"},${Math.random() * 0.14})`;
    g.fillRect(Math.random() * 1024, Math.random() * 1024, 2 + Math.random() * 3, 2 + Math.random() * 3);
  }
  const ivory = "#F5F0E6";
  const forest = "#183C32";
  // y runs bottom→top of the lathe (v=0 at the base) — canvas y is flipped
  const yv = (v: number) => (1 - v) * 1024;
  const line = (v: number, h: number, col: string) => {
    g.fillStyle = col;
    g.fillRect(0, yv(v) - h / 2, 1024, h);
  };
  const tris = (v: number, hgt: number, n: number, col: string, flip = false) => {
    g.fillStyle = col;
    const w = 1024 / n;
    for (let i = 0; i < n; i++) {
      g.beginPath();
      const y0 = yv(v);
      if (!flip) {
        g.moveTo(i * w, y0);
        g.lineTo(i * w + w, y0);
        g.lineTo(i * w + w / 2, y0 - hgt);
      } else {
        g.moveTo(i * w, y0 - hgt);
        g.lineTo(i * w + w, y0 - hgt);
        g.lineTo(i * w + w / 2, y0);
      }
      g.fill();
    }
  };
  const dots = (v: number, n: number, r: number, col: string) => {
    g.fillStyle = col;
    for (let i = 0; i < n; i++) {
      g.beginPath();
      g.arc((i + 0.5) * (1024 / n), yv(v), r, 0, Math.PI * 2);
      g.fill();
    }
  };
  line(0.2, 10, ivory);
  line(0.24, 4, ivory);
  tris(0.3, 52, 16, ivory);
  tris(0.3, 52, 16, forest, true);
  line(0.4, 6, ivory);
  dots(0.46, 24, 7, ivory);
  line(0.52, 6, ivory);
  tris(0.58, 60, 16, forest);
  tris(0.58, 60, 16, ivory, true);
  line(0.68, 4, ivory);
  line(0.71, 12, forest);
  dots(0.78, 32, 4, ivory);
  line(0.85, 8, ivory);
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

const potProfile = () =>
  new THREE.SplineCurve(
    [
      [0, 0],
      [0.5, 0],
      [0.68, 0.06],
      [0.92, 0.45],
      [1.1, 0.95],
      [1.04, 1.45],
      [0.72, 1.82],
      [0.5, 2.0],
      [0.5, 2.2],
      [0.64, 2.3],
      [0.6, 2.35],
      [0.42, 2.3],
      [0.4, 2.0],
      [0, 1.9],
    ].map(([x, y]) => new THREE.Vector2(x, y)),
  ).getPoints(140);

const lampProfile = () =>
  new THREE.SplineCurve(
    [
      [0, 0],
      [0.9, 0],
      [0.98, 0.07],
      [0.8, 0.14],
      [0.38, 0.22],
      [0.22, 0.45],
      [0.34, 0.62],
      [0.2, 0.82],
      [0.46, 0.96],
      [0.95, 1.06],
      [1.32, 1.24],
      [1.4, 1.42],
      [1.26, 1.44],
      [1.0, 1.32],
      [0.55, 1.22],
      [0, 1.18],
    ].map(([x, y]) => new THREE.Vector2(x, y)),
  ).getPoints(160);

export default function Craft3D({
  variant,
  interactive,
  followPointer,
  className,
  label,
}: Props) {
  const host = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = host.current;
    if (!el) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      setFailed(true);
      return;
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.domElement.style.cssText =
      "position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:pan-y;";
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    scene.environmentIntensity = variant === "lamp" ? 1.1 : 0.55;

    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 50);
    camera.position.set(0, 1.4, 8.6);

    scene.add(new THREE.HemisphereLight(0xf5f0e6, 0x183c32, 0.7));
    const key = new THREE.DirectionalLight(0xfff0d9, 2.4);
    key.position.set(3.5, 4.5, 4);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xbc6847, 1.4);
    rim.position.set(-4, 2, -3);
    scene.add(rim);

    const disposables: { dispose: () => void }[] = [];
    const pivot = new THREE.Group(); // rotates
    const floater = new THREE.Group(); // bobs
    floater.add(pivot);
    scene.add(floater);

    const profile = variant === "pot" ? potProfile() : lampProfile();
    const geo = new THREE.LatheGeometry(profile, 96);
    disposables.push(geo);
    let flame: THREE.Mesh | null = null;
    let flameLight: THREE.PointLight | null = null;

    let mat: THREE.MeshStandardMaterial;
    if (variant === "pot") {
      const tex = makePotTexture();
      disposables.push(tex);
      mat = new THREE.MeshStandardMaterial({
        map: tex,
        roughness: 0.68,
        metalness: 0.02,
        side: THREE.DoubleSide,
      });
    } else {
      mat = new THREE.MeshStandardMaterial({
        color: 0xc79a52,
        roughness: 0.26,
        metalness: 1,
        side: THREE.DoubleSide,
      });
      // engraved brass rings
      const ringMat = new THREE.MeshStandardMaterial({
        color: 0x9d7434,
        roughness: 0.35,
        metalness: 1,
      });
      disposables.push(ringMat);
      [
        [0.98, 0.08],
        [0.34, 0.6],
        [1.4, 1.43],
      ].forEach(([r, y]) => {
        const tg = new THREE.TorusGeometry(r, 0.025, 12, 96);
        disposables.push(tg);
        const m = new THREE.Mesh(tg, ringMat);
        m.rotation.x = Math.PI / 2;
        m.position.y = y;
        pivot.add(m);
      });
      // flame
      const fp = new THREE.SplineCurve(
        [
          [0, 0],
          [0.12, 0.06],
          [0.16, 0.2],
          [0.1, 0.4],
          [0.03, 0.6],
          [0, 0.7],
        ].map(([x, y]) => new THREE.Vector2(x, y)),
      ).getPoints(24);
      const fg = new THREE.LatheGeometry(fp, 20);
      const fm = new THREE.MeshBasicMaterial({
        color: 0xffb54a,
        transparent: true,
        opacity: 0.92,
      });
      disposables.push(fg, fm);
      flame = new THREE.Mesh(fg, fm);
      flame.position.y = 1.2;
      pivot.add(flame);
      flameLight = new THREE.PointLight(0xffa24a, 6, 6, 1.6);
      flameLight.position.y = 1.7;
      pivot.add(flameLight);
    }
    disposables.push(mat);
    pivot.add(new THREE.Mesh(geo, mat));

    // Centre the object on its bounding box
    const box = new THREE.Box3().setFromObject(pivot);
    const centre = box.getCenter(new THREE.Vector3());
    pivot.children.forEach((c) => (c.position.y -= centre.y));
    pivot.rotation.z = variant === "pot" ? 0.04 : 0;

    // Sizing
    const resize = () => {
      const w = el.clientWidth || 1;
      const h = el.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.position.z = (variant === "pot" ? 8.4 : 8.2) / Math.min(1, camera.aspect * 1.05);
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    // Interaction
    let dragging = false;
    let lastX = 0;
    let vel = 0;
    let userRot = 0;
    const pointer = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };

    const onDown = (e: PointerEvent) => {
      if (!interactive) return;
      dragging = true;
      lastX = e.clientX;
      renderer.domElement.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      vel = dx * 0.012;
      userRot += vel;
    };
    const onUp = () => {
      dragging = false;
    };
    const onPointerGlobal = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    renderer.domElement.addEventListener("pointerdown", onDown);
    renderer.domElement.addEventListener("pointermove", onMove);
    renderer.domElement.addEventListener("pointerup", onUp);
    renderer.domElement.addEventListener("pointercancel", onUp);
    if (followPointer) window.addEventListener("pointermove", onPointerGlobal, { passive: true });

    // Only render when visible
    let visible = true;
    const io = new IntersectionObserver(([en]) => (visible = en.isIntersecting), {
      threshold: 0,
    });
    io.observe(el);

    const timer = new THREE.Timer();
    timer.connect(document);
    let raf = 0;
    let auto = 0;
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (!visible || document.hidden) return;
      timer.update(now);
      const dt = Math.min(timer.getDelta(), 0.05);
      const t = timer.getElapsed();
      if (!reduce) {
        auto += dt * 0.35;
        floater.position.y = Math.sin(t * 1.1) * 0.1;
      }
      if (!dragging) {
        vel *= 0.93;
        userRot += vel;
      }
      target.x += (pointer.y * 0.22 - target.x) * 0.05;
      target.y += (pointer.x * 0.5 - target.y) * 0.05;
      pivot.rotation.y = auto + userRot + (followPointer ? target.y : 0);
      pivot.rotation.x = followPointer ? target.x : 0.06;
      if (flame && flameLight) {
        const f = 1 + Math.sin(t * 13) * 0.05 + Math.sin(t * 7.3) * 0.06;
        flame.scale.set(1 + Math.sin(t * 9) * 0.05, f, 1 + Math.cos(t * 8) * 0.05);
        flameLight.intensity = 5 + Math.sin(t * 11) * 1.2;
      }
      renderer.render(scene, camera);
    };
    tick(performance.now());

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onPointerGlobal);
      renderer.domElement.removeEventListener("pointerdown", onDown);
      renderer.domElement.removeEventListener("pointermove", onMove);
      renderer.domElement.removeEventListener("pointerup", onUp);
      renderer.domElement.removeEventListener("pointercancel", onUp);
      disposables.forEach((d) => d.dispose());
      timer.disconnect();
      envTex.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
  }, [variant, interactive, followPointer]);

  return (
    <div
      ref={host}
      role="img"
      aria-label={label}
      className={className}
      style={{ position: "relative" }}
    >
      {failed && (
        <Mandala className="absolute inset-0 h-full w-full text-terracotta/60" />
      )}
    </div>
  );
}
