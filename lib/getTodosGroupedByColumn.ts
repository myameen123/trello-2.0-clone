import { database } from "@/appwrite";

export const getTodosGroupedByColumn = async () => {
  const data = await database.listDocuments(
    process.env.NEXT_PUBLIC_DATABASE_ID!,
    process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!
  );
  const todos = data.documents;
  const columns = todos.reduce((acc, todo) => {
    if (!acc.get(todo.status)) {
      acc.set(todo.status, {
        id: todo.status,
        todos: [],
      });
    }
    acc.get(todo.status)!.todos.push({
      $id: todo.$id,
      $createdAt: todo.$createdAt,
      $status: todo.status,
      $title: todo.title,
      ...[todo.image && { image: JSON.parse(todo.image) }],
    });
    return acc;
  }, new Map<TypedColumn, Column>());
  //   console.log(columns);
  // if column doesnt have ingpress, todo, and dome, add them with empty todo
  const columnTypes: TypedColumn[] = ["todo", "inprogress", "done"];
  for (const coulmnType of columnTypes) {
    if (!columns.get(coulmnType)) {
      columns.set(coulmnType, {
        id: coulmnType,
        todos: [],
      });
    }
  }
  console.log(columns);
  // Sort columns by columnTypes
  const sortedCoulmns = new Map(
    Array.from(columns.entries()).sort(
      (a, b) => columnTypes.indexOf(a[0]) - columnTypes.indexOf(b[0])
    )
  );
  const board: Board = {
    columns: sortedCoulmns,
  };
  return board;
};
