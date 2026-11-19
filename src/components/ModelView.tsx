import { OrbitControls, PerspectiveCamera, View } from "@react-three/drei";
import * as THREE from "three";
import { Suspense } from "react";
import type { ComponentRef, RefObject } from "react";
import type { ModelItem } from "../constants";
import Lights from "./Lights";
import Loader from "./Loader";
import IPhone from "./IPhone";

/** The two cameras share their orbit angles when switching model sizes. */
export interface OrbitControlsRef {
  getAzimuthalAngle: () => number;
  getPolarAngle: () => number;
  setAzimuthalAngle: (angle: number) => void;
  setPolarAngle: (angle: number) => void;
  enableDamping: boolean;
}

export interface ModelViewProps {
  index: number;
  gsapType: string;
  controlRef: RefObject<OrbitControlsRef | null>;
  size: "small" | "large";
  item: ModelItem;
  autoRotate: boolean;
  onInteractionStart: () => void;
  onInteractionEnd: () => void;
}

/**
 * One 3D viewport (view1 or view2), with its own camera and orbit controls.
 */
function ModelView({
  index,
  gsapType,
  controlRef,
  size,
  item,
  autoRotate,
  onInteractionStart,
  onInteractionEnd,
}: ModelViewProps): React.ReactElement {
  return (
    <View
      index={index}
      id={gsapType}
      className={`w-full h-full absolute ${index === 2 ? "right-[-100%]" : ""}`}
    >
      <ambientLight intensity={0.3} />
      <PerspectiveCamera makeDefault position={[0, 0, 4]} />
      <Lights />
      <OrbitControls
        makeDefault
        ref={controlRef as RefObject<ComponentRef<typeof OrbitControls>>}
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.4}
        autoRotate={autoRotate}
        autoRotateSpeed={0.7}
        target={new THREE.Vector3(0, 0, 0)}
        onStart={onInteractionStart}
        onEnd={onInteractionEnd}
      />
      <group
        name={index === 1 ? "small" : "large"}
        position={[0, 0, 0]}
      >
        <Suspense fallback={<Loader />}>
          {/* scale differs by index so small/large views have different model size */}
          <IPhone
            scale={index === 1 ? [15, 15, 15] : [17, 17, 17]}
            item={item}
            size={size}
          />
        </Suspense>
      </group>
    </View>
  );
}

export default ModelView;
