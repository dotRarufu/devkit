import { createContext, useContext, type ReactNode, type Context } from "react";

/**
 * =========================================================
 * createSafeContext
 * =========================================================
 *
 * Utility for creating strongly-typed React contexts
 * with automatic safety checks.
 *
 * Features:
 * - Prevents undefined context usage
 * - Removes repetitive boilerplate
 * - Strong TypeScript support
 * - Reusable across modules
 *
 * =========================================================
 */

type ProviderProps<T> = {
  value: T;
  children: ReactNode;
};

export function createSafeContext<T>(contextName: string) {
  const Context = createContext<T | undefined>(undefined);

  const useSafeContext = () => {
    const context = useContext(Context);

    if (!context) {
      throw new Error(
        `${contextName} must be used within ${contextName}.Provider`,
      );
    }

    return context;
  };

  const Provider = ({ value, children }: ProviderProps<T>) => {
    return <Context.Provider value={value}>{children}</Context.Provider>;
  };

  return {
    Context: Context as Context<T>,
    Provider,
    useContext: useSafeContext,
  };
}

// ===== EXAMPLE ==========
// import React, { useState } from "react";
// import { createSafeContext } from "../../lib/react/createSafeContext";

// const { Provider: SelectedContextProvider, useContext } =
//   createSafeContext<SelectedContextType>("SelectedContext");

// type Props = {
//   children: React.ReactNode | ((value: SelectedContextType) => React.ReactNode);
//   // onDocumentStatusChange?: () => void;
//   // onTimePeriodChange?: () => void;
//   // onSearch?: () => void;
// };

// // eslint-disable-next-line react-refresh/only-export-components
// export const useSelectedContext = useContext;

// const SelectedProvider = (props: Props) => {
//   const [selectedItems, setSelectedItems] = useState<string[]>([]);
//   const clear = () => setSelectedItems([]);
//   const selectItem = (item: string) =>
//     setSelectedItems((prev) => [...prev, item]);
//   const removeItem = (item: string) =>
//     setSelectedItems((prev) => prev.filter((i) => i !== item));

//   const value: SelectedContextType = {
//     removeItem,
//     selectItem,
//     clear,
//     selectedItems,
//   };

//   return (
//     <SelectedContextProvider value={value}>
//       {typeof props.children === "function"
//         ? props.children(value)
//         : props.children}
//     </SelectedContextProvider>
//   );
// };

// type SelectedContextType = {
//   removeItem: (item: string) => void;
//   selectItem: (item: string) => void;
//   clear: () => void;
//   selectedItems: string[];
// };

// export default SelectedProvider;
