import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber/native";
import { MeshSurfaceSampler } from "three-stdlib";

type Distribution = "random" | "weighted";

const easeOutCubic = (t: number) => (--t) * t * t + 1;

// scaling curve from the sample
const scaleCurve = (t: number) =>
  Math.abs(easeOutCubic(((t > 0.5 ? 1 - t : t) * 2)));

export function ScatterGarden(props: {
  count?: number;
  distribution?: Distribution;
}) {
  const count = props.count ?? 2000;
  const distribution = props.distribution ?? "random";

  // --- Surface (torus knot) ---
  const surfaceRef = useRef<THREE.Mesh>(null);

  const surfaceGeometry = useMemo(
    () => new THREE.TorusKnotGeometry(10, 3, 100, 16).toNonIndexed(),
    []
  );

  const surfaceMaterial = useMemo(
    () =>
      new THREE.MeshLambertMaterial({
        color: 0xfff784, // sample-ish
        wireframe: false,
      }),
    []
  );

  // --- Instanced meshes ---
  const stemRef = useRef<THREE.InstancedMesh>(null);
  const blossomRef = useRef<THREE.InstancedMesh>(null);

  // simple placeholder geometries (we’ll swap to GLB later)
  const stemGeometry = useMemo(() => new THREE.CylinderGeometry(0.03, 0.06, 0.7, 6), []);
  const blossomGeometry = useMemo(() => new THREE.SphereGeometry(0.12, 8, 8), []);

  const stemMaterial = useMemo(
    () => new THREE.MeshLambertMaterial({ color: 0x2f8f4e }),
    []
  );

  const blossomMaterial = useMemo(
    () =>
      new THREE.MeshLambertMaterial({
        vertexColors: true, // required for per-instance colors
      }),
    []
  );

  const blossomPalette = useMemo(
    () => [0xf20587, 0xf2d479, 0xf2c879, 0xf2b077, 0xf24405],
    []
  );

  // --- Simulation buffers (like sample) ---
  const ages = useMemo(() => new Float32Array(count), [count]);
  const scales = useMemo(() => new Float32Array(count), [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const _position = useMemo(() => new THREE.Vector3(), []);
  const _normal = useMemo(() => new THREE.Vector3(), []);
  const _scale = useMemo(() => new THREE.Vector3(), []);

  const samplerRef = useRef<MeshSurfaceSampler | null>(null);

  // initialize sampler + instances
  useEffect(() => {
    const surface = surfaceRef.current;
    const stem = stemRef.current;
    const blossom = blossomRef.current;

    if (!surface || !stem || !blossom) return;

    samplerRef.current = new MeshSurfaceSampler(surface)
      .setWeightAttribute(distribution === "weighted" ? "uv" : null)
      .build();

    // Assign random colors to blossoms (matches sample idea)
    const color = new THREE.Color();
    for (let i = 0; i < count; i++) {
      color.setHex(blossomPalette[(Math.random() * blossomPalette.length) | 0]);
      blossom.setColorAt(i, color);
    }

    // Instance matrices will be updated every frame
    stem.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    blossom.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

    // initial sample
    for (let i = 0; i < count; i++) {
      ages[i] = Math.random();
      scales[i] = scaleCurve(ages[i]);
      resampleParticle(i);
    }

    stem.instanceMatrix.needsUpdate = true;
    blossom.instanceMatrix.needsUpdate = true;
    blossom.instanceColor!.needsUpdate = true;

    function resampleParticle(i: number) {
      const sampler = samplerRef.current!;
      sampler.sample(_position, _normal);
      _normal.add(_position); // point “outward” like sample

      dummy.position.copy(_position);
      dummy.scale.set(scales[i], scales[i], scales[i]);
      dummy.lookAt(_normal);

      // offset stem down so blossom sits on top
      // (purely aesthetic to resemble stem+blossom)
      dummy.updateMatrix();

      stem?.setMatrixAt(i, dummy.matrix);

      // For blossom, move upward in local space by modifying dummy temporarily
      const m = dummy.matrix.clone();
      const offset = new THREE.Matrix4().makeTranslation(0, 0.45, 0);
      m.multiply(offset);
      blossom?.setMatrixAt(i, m);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, distribution, blossomPalette, ages, scales, dummy, _position, _normal]);

  // lifecycle updates each frame
  useFrame((state, delta) => {
    const stem = stemRef.current;
    const blossom = blossomRef.current;
    if (!stem || !blossom || !samplerRef.current) return;

    const time = state.clock.elapsedTime;

    // rotate whole scene (match sample)
    // we rotate the *group* by returning it below and using groupRef,
    // but easiest is to rotate surface + instances similarly:
    const rx = Math.sin(time / 4);
    const ry = Math.sin(time / 2);

    surfaceRef.current!.rotation.x = rx;
    surfaceRef.current!.rotation.y = ry;
    stem.rotation.x = rx;
    stem.rotation.y = ry;
    blossom.rotation.x = rx;
    blossom.rotation.y = ry;

    for (let i = 0; i < count; i++) updateParticle(i);

    stem.instanceMatrix.needsUpdate = true;
    blossom.instanceMatrix.needsUpdate = true;

    // optional: bounding sphere updates (safer with large rotations)
    stem.computeBoundingSphere();
    blossom.computeBoundingSphere();

    function resampleParticle(i: number) {
      samplerRef.current!.sample(_position, _normal);
      _normal.add(_position);

      dummy.position.copy(_position);
      dummy.scale.set(scales[i], scales[i], scales[i]);
      dummy.lookAt(_normal);
      dummy.updateMatrix();

      stem?.setMatrixAt(i, dummy.matrix);

      const m = dummy.matrix.clone();
      const offset = new THREE.Matrix4().makeTranslation(0, 0.45, 0);
      m.multiply(offset);
      blossom?.setMatrixAt(i, m);
    }

    function updateParticle(i: number) {
      // lifecycle speed — you can tune later
      ages[i] += 0.005;

      if (ages[i] >= 1) {
        ages[i] = 0.001;
        scales[i] = scaleCurve(ages[i]);
        resampleParticle(i);
        return;
      }

      const prevScale = scales[i];
      scales[i] = scaleCurve(ages[i]);

      const s = scales[i] / prevScale;
      _scale.set(s, s, s);

      // scale existing matrix in place
      stem?.getMatrixAt(i, dummy.matrix);
      dummy.matrix.scale(_scale);
      stem?.setMatrixAt(i, dummy.matrix);

      blossom?.getMatrixAt(i, dummy.matrix);
      dummy.matrix.scale(_scale);
      blossom?.setMatrixAt(i, dummy.matrix);
    }
  });

  return (
    <>
      {/* Lighting similar to sample */}
      <ambientLight intensity={3} />
      <pointLight color={0xaa8899} intensity={2.5} position={[50, -25, 75]} />

      {/* Surface */}
      <mesh ref={surfaceRef} geometry={surfaceGeometry} material={surfaceMaterial} />

      {/* Instances */}
      <instancedMesh ref={stemRef} args={[stemGeometry, stemMaterial, count]} />
      <instancedMesh ref={blossomRef} args={[blossomGeometry, blossomMaterial, count]} />
    </>
  );
}
