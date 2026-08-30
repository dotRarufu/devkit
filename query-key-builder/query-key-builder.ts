/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-explicit-any */

// SAMPLE USAGE
// export const assetKeys = createQueryKeys("assets", (root) =>
//   root
//     .child("list")
//     .child("detail", (detail) => detail.child("history").child("attachments"))
//     .child("statistics"),
// );

type QueryKey = readonly unknown[];

interface QueryNode {
  all(): QueryKey;
  key(...args: unknown[]): QueryKey;
}

interface Definition {
  [key: string]: Definition;
}

type BuildNode<T extends Definition> = QueryNode & {
  [K in keyof T]: BuildNode<T[K]>;
};

class Builder<T extends Definition = {}> {
  private readonly definition: T;

  constructor(definition: T = {} as T) {
    this.definition = definition;
  }

  child<const Name extends string, const Children extends Definition = {}>(
    name: Name,
    configure?: (builder: Builder<{}>) => Builder<Children>,
  ): Builder<
    T & {
      [K in Name]: Children;
    }
  > {
    const childDefinition = configure?.(new Builder()).definitionObject ?? {};

    return new Builder({
      ...this.definition,
      [name]: childDefinition,
    } as any);
  }

  get definitionObject() {
    return this.definition;
  }
}

function buildNode(path: readonly string[], definition: Definition): QueryNode {
  const node = {
    all: () => path,
    key: (...args: unknown[]) => [...path, ...args] as const,
  } as QueryNode & Record<string, unknown>;

  for (const key in definition) {
    node[key] = buildNode([...path, key], definition[key]);
  }

  return node;
}

export function createQueryKeys<
  const Scope extends string,
  const Tree extends Definition,
>(
  scope: Scope,
  configure: (builder: Builder<{}>) => Builder<Tree>,
): BuildNode<Tree> {
  const tree = configure(new Builder()).definitionObject;

  return buildNode([scope], tree) as BuildNode<Tree>;
}
