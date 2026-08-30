/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useImperativeHandle,
  useMemo,
  useState,
  type ComponentType,
  type ReactNode,
  type Ref,
} from "react";

type OverlayProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type OverlayComponent = ComponentType<OverlayProps>;

type OverlayRegistry = Record<string, OverlayComponent>;

export type OverlayManagerRef = {
  open: (name: string) => void;
  close: () => void;
  toggle: (name: string) => void;
  isOpen: (name: string) => boolean;
  setContext: (v: any) => void;
  context: any;
  active: string | null;
};

type OverlayManagerContextValue = OverlayManagerRef;

const OverlayManagerContext = createContext<OverlayManagerContextValue | null>(
  null,
);

type OverlayManagerProps = {
  overlays: OverlayRegistry;
  children: ReactNode;
};

export const OverlayManager = forwardRef(function OverlayManager(
  { overlays, children }: OverlayManagerProps,
  ref: Ref<OverlayManagerRef>,
) {
  const [active, setActive] = useState<string | null>(null);
  const [context, setContext] = useState<any>(null);

  const open = useCallback(
    (name: string) => {
      if (!overlays[name]) {
        throw new Error(`Overlay "${name}" is not registered.`);
      }

      setActive(name);
    },
    [overlays],
  );

  const close = useCallback(() => {
    setActive(null);
  }, []);

  const toggle = useCallback(
    (name: string) => {
      setActive((current) => {
        if (current === name) {
          return null;
        }

        if (!overlays[name]) {
          throw new Error(`Overlay "${name}" is not registered.`);
        }

        return name;
      });
    },
    [overlays],
  );

  const isOpen = useCallback((name: string) => active === name, [active]);

  const manager = useMemo<OverlayManagerRef>(
    () => ({
      open,
      close,
      toggle,
      isOpen,
      active,
      setContext,
      context,
    }),
    [open, close, toggle, isOpen, active, context],
  );

  useImperativeHandle(ref, () => manager, [manager]);

  return (
    <OverlayManagerContext.Provider value={manager}>
      {children}

      {Object.entries(overlays).map(([name, Overlay]) => (
        <Overlay
          key={name}
          open={active === name}
          onOpenChange={(open) => {
            if (!open && active === name) {
              close();
            }
          }}
        />
      ))}
    </OverlayManagerContext.Provider>
  );
});

// eslint-disable-next-line react-refresh/only-export-components
export function useOverlayManager() {
  const context = useContext(OverlayManagerContext);

  if (!context) {
    throw new Error("useOverlayManager must be used inside OverlayManager");
  }

  return context;
}

// one overlay at a time

// ====EXAMPLE USAGE====

//  <OverlayManager
//       ref={overlayManagerRef}
//       overlays={{
//         edit: GarmentEdit,
//         details: GarmentDetails,
//         delete: GarmentDelete,
//       }}
//     >
//       <li
//         className={cn(
//           "rounded-xl bg-[#EFE9E3] p-4",
//           "flex cursor-pointer flex-col gap-3",
//         )}
//         onClick={() => {
//           overlayManagerRef.current?.open("details");
//         }}
//       >
//         <p className="text-[1.3125rem] leading-none font-medium">
//           {props.name}
//         </p>
//         <ul className="flex gap-2">{props.tags}</ul>
//       </li>
//     </OverlayManager>

//  const { open } = useOverlayManager();
