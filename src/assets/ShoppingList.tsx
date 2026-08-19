import { useParams } from "react-router-dom";

function ShoppingList() {
  const { id } = useParams();

  return (
    <main>
      <h1>Shopping List</h1>
      <p>List ID: {id}</p>
    </main>
  );
}

export default ShoppingList;