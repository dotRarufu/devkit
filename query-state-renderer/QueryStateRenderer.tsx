import type { ComponentType } from "react";
import type { UseQueryResult } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";

type QueryStateWrapperProps<TData> = {
  query: UseQueryResult<TData, Error>;

  Loader: ComponentType;
  Error: ComponentType<{ error: Error }>;
  Empty: ComponentType;
  Data: ComponentType<{ data: TData }>;

  /**
   * Determines whether the successful query data should be
   * treated as empty.
   */
  isEmpty?: (data: TData) => boolean;

  loadingWhen?: "pending" | "fetching" | "refetching";
};

export function QueryStateRenderer<TData>({
  query,
  Loader,
  Error,
  Empty,
  Data,
  isEmpty,
  loadingWhen = "pending",
}: QueryStateWrapperProps<TData>) {
  const shouldShowLoader =
    loadingWhen === "pending"
      ? query.isPending
      : loadingWhen === "fetching"
        ? query.isFetching
        : query.isRefetching;

  let content: React.ReactNode;
  let key: "loading" | "error" | "empty" | "data";

  if (shouldShowLoader) {
    key = "loading";
    content = <Loader />;
  } else if (query.isError) {
    key = "error";
    content = <Error error={query.error} />;
  } else if (query.isSuccess) {
    const empty = isEmpty?.(query.data) ?? false;

    if (empty) {
      key = "empty";
      content = <Empty />;
    } else {
      key = "data";
      content = <Data data={query.data} />;
    }
  } else {
    return null;
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={key}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="h-full w-full"
      >
        {content}
      </motion.div>
    </AnimatePresence>
  );
}

{
  /*
### Usage

For an array:

```tsx
<QueryStateWrapper
  query={courtPerformanceQuery}
  Loader={PieChartLoader}
  Error={ChartError}
  Empty={EmptyChart}
  Data={CourtPerformanceChart}
  isEmpty={(data) => data.length === 0}
/>
```

For an object:

```tsx
<QueryStateWrapper
  query={courtPerformanceQuery}
  Loader={PieChartLoader}
  Error={ChartError}
  Empty={EmptyChart}
  Data={CourtPerformanceChart}
  isEmpty={(data) => data.items.length === 0}
/>
```

If you want the empty state to be **optional**, the implementation above already supports that: if `isEmpty` isn't provided, successful data always renders `Data`.

One small naming point: I prefer `isEmpty` as a **function** rather than a boolean because the wrapper doesn't need to know anything about the shape of `TData`.

*/
}
