import EmptyStateImage from "../assets/EmptyStateImage.png";

function Home() {
  return (
    <main className="home-page">
      <section className="page-header">
        <div>
          <h1>My Shopping Lists</h1>
        </div>

      </section>

      <section className="empty-state">
        <div className="empty-state"> <img
              src={EmptyStateImage} alt="empty-state"/>
        </div>

        <h2>Your shopping list is empty</h2>

        <p>
          Start by creating your first shopping list.
        </p>

        <button className="button button-primary">
          Create Shopping List
        </button>
      </section>
    </main>
  );
}

export default Home;